package com.younged.service.impl;

import com.younged.model.Student;
import com.younged.repository.StudentRepository;
import com.younged.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository repo;

    @Override
    public Student save(Student student) {
        return repo.save(student);
    }

    @Override
    public List<Student> getAll() {
        return repo.findAll();
    }

    @Override
    public Student update(Long id, Student updatedStudent) {
        Student existing = repo.findById(id).orElseThrow();
        existing.setName(updatedStudent.getName());
        existing.setAge(updatedStudent.getAge());
        existing.setGender(updatedStudent.getGender());
        existing.setGrade(updatedStudent.getGrade());
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}