package com.younged.service;

import com.younged.model.Student;
import com.younged.repository.StudentRepository;
import com.younged.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveStudent() {
        Student student = new Student(null, "Aris", 21, "Male", "12th");
        Student saved = new Student(1L, "Aris", 21, "Male", "12th");

        when(studentRepository.save(student)).thenReturn(saved);

        Student result = studentService.save(student);
        assertEquals("Aris", result.getName());
        assertEquals(21, result.getAge());
    }

    @Test
    void testGetAll() {
        List<Student> students = Arrays.asList(
                new Student(1L, "Alice", 14, "Female", "8th"),
                new Student(2L, "Bob", 15, "Male", "9th")
        );

        when(studentRepository.findAll()).thenReturn(students);

        List<Student> result = studentService.getAllFilteredAndSorted(null, null, null, null, null, null);
        assertEquals(2, result.size());
    }

    @Test
    void testUpdate() {
        Student existing = new Student(1L, "Alice", 14, "Female", "8th");
        Student updated = new Student(1L, "AliceUpdated", 15, "Female", "9th");

        when(studentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(studentRepository.save(any(Student.class))).thenReturn(updated);

        Student result = studentService.update(1L, updated);

        assertEquals("AliceUpdated", result.getName());
        assertEquals(15, result.getAge());
    }

    @Test
    void testDelete() {
        studentService.delete(1L);
        verify(studentRepository, times(1)).deleteById(1L);
    }
}