package com.example.restservice.model;
import java.util.List;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
@Node
public class Post {
    @Id
    String post_id;
    

    @Relationship(type = "GET_COMMENTED")
    private List<Comment> comments;



}