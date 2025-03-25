package com.POO.tallerRabbitMQ.Publisher;
import com.POO.tallerRabbitMQ.Models.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

@Component
@RestController
@RequestMapping("/publisher")
public class Publisher {
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public Publisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @PostMapping("/publishMessage")
    public ResponseEntity<Message> publishMessage(@RequestBody Message message) {
        String exchangeName = "amq." + message.getExchange().toLowerCase();
        String routingKey = message.getRouting_key().toLowerCase();
        rabbitTemplate.convertAndSend(exchangeName, routingKey, message);
        return ResponseEntity.ok(message);
    }
}
