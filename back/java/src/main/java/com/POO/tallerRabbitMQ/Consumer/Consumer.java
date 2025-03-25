package com.POO.tallerRabbitMQ.Consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.*;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RestController
@RequestMapping("/consumer")
public class Consumer {
    private final RabbitAdmin rabbitAdmin;
    private final RabbitTemplate rabbitTemplate;
    private final FanoutExchange fanoutExchange;
    private final TopicExchange topicExchange;
    private final DirectExchange directExchange;
    private final String queueName;
    
    @Autowired
    public Consumer(RabbitAdmin rabbitAdmin, RabbitTemplate rabbitTemplate,
                              FanoutExchange fanoutExchange, TopicExchange topicExchange,
                              DirectExchange directExchange) {
        this.rabbitAdmin = rabbitAdmin;
        this.rabbitTemplate = rabbitTemplate;
        this.fanoutExchange = fanoutExchange;
        this.topicExchange = topicExchange;
        this.directExchange = directExchange;

        // Crear una cola temporal para cada instancia
        this.queueName = declareTempQueue();
        rabbitAdmin.declareBinding(BindingBuilder.bind(new Queue(queueName)).to(fanoutExchange));
    }
    
    private String declareTempQueue() {
        Queue tempQueue = new AnonymousQueue();
        rabbitAdmin.declareQueue(tempQueue);
        return tempQueue.getName();
    }
    
    private void updateBindings(List<String> temasSuscritos) {
        List<String> temasDisponibles = List.of("Deportes", "Entretenimiento", "Tecnologia");

        for (String tema : temasDisponibles) {
            if (!temasSuscritos.contains(tema)) {
                rabbitAdmin.removeBinding(BindingBuilder.bind(new Queue(queueName)).to(topicExchange).with(tema.toLowerCase()));
                rabbitAdmin.removeBinding(BindingBuilder.bind(new Queue(queueName)).to(directExchange).with(tema.toLowerCase()));
            } else {
                rabbitAdmin.declareBinding(BindingBuilder.bind(new Queue(queueName)).to(topicExchange).with(tema.toLowerCase()));
                rabbitAdmin.declareBinding(BindingBuilder.bind(new Queue(queueName)).to(directExchange).with(tema.toLowerCase()));
            }
        }
    }
    
    @PostMapping("/getMessages")
    public ResponseEntity<Map<String, List<Map<String, String>>>> getMessages(@RequestBody List<String> temasSuscritos) {
        updateBindings(temasSuscritos);

        List<Map<String, String>> mensajes = new ArrayList<>();
        Message message;

        while ((message = rabbitTemplate.receive(queueName)) != null) {
            String body = new String(message.getBody(), StandardCharsets.UTF_8);

            // Convertimos el JSON del mensaje a un Map
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                Map<String, String> mensajeMap = objectMapper.readValue(body, new TypeReference<Map<String, String>>() {});

                // Asegurar que tenga la estructura correcta
                Map<String, String> mensajeFinal = new HashMap<>();
                mensajeFinal.put("autor", mensajeMap.getOrDefault("autor", "Desconocido"));
                mensajeFinal.put("fecha", mensajeMap.getOrDefault("fecha", LocalDateTime.now().toString()));
                mensajeFinal.put("routing_key", mensajeMap.getOrDefault("routing_key", "Sin clave"));
                mensajeFinal.put("exchange", mensajeMap.getOrDefault("exchange", "Desconocido"));
                mensajeFinal.put("mensaje", mensajeMap.getOrDefault("mensaje", "Sin contenido"));

                mensajes.add(mensajeFinal);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        // Devolver la estructura correcta
        Map<String, List<Map<String, String>>> response = new HashMap<>();
        response.put("mensajes", mensajes);

        return ResponseEntity.ok(response);
    }
}
