package com.younged.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.younged.model.Student;
import com.younged.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.WebRequest;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@ExtendWith(MockitoExtension.class)
class StudentControllerTest {

    @Mock
    private StudentService studentService;

    @InjectMocks
    private StudentController studentController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private Student student;
    private Student savedStudent;

    @BeforeEach
    void setUp() {
        student = new Student(null, "Aris", 21, "Male", "12th");
        savedStudent = new Student(1L, "Aris", 21, "Male", "12th");
    }

    @Test
    void testCreateStudent() {
        when(studentService.save(any(Student.class))).thenReturn(savedStudent);

        Student response = studentController.create(student);

        assertNotNull(response);
        assertEquals("Aris", response.getName());
        assertEquals(1L, response.getId());
    }

    @Test
    void testGetAllStudents() {
        when(studentService.getAllFilteredAndSorted(null, null, null, null, null, null))
                .thenReturn(Collections.singletonList(savedStudent));

        List<Student> result = studentController.getAllFilteredAndSorted(null, null, null, null, null, null);

        assertEquals(1, result.size());
        assertEquals("Aris", result.get(0).getName());
    }
}