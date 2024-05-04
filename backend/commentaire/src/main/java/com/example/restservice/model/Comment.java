package com.example.restservice.model;



import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
@Node
public class Comment {

    @Id
    private String comment_id;
    private String author_id;
    private String text;
    private String date;

}