
package com.younged.controller;

import com.younged.model.Student;
import com.younged.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentService service;

    @PostMapping
    public Student create(@RequestBody Student student) {
        System.out.println("➡️ Received POST request to create student: " + student);
        Student savedStudent = service.save(student);
        System.out.println("✅ Student saved: " + savedStudent);
        return savedStudent;
    }

    @GetMapping
    public List<Student> getAll() {
        return service.getAll();
    }

    @PatchMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student student) {
        return service.update(id, student);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}