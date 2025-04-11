package com.younged.service.impl;

import com.younged.model.Student;
import com.younged.repository.StudentRepository;
import com.younged.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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
    public List<Student> getAllFilteredAndSorted(String name, Integer age, String gender, String grade, String sortBy, String direction) {
        List<Student> students = repo.findAll();

        // Filtering
        if (name != null && !name.isEmpty()) {
            students = students.stream()
                    .filter(s -> s.getName().toLowerCase().contains(name.toLowerCase()))
                    .toList();
        }
        if (age != null) {
            students = students.stream()
                    .filter(s -> s.getAge() == age)
                    .toList();
        }
        if (gender != null && !gender.isEmpty()) {
            students = students.stream()
                    .filter(s -> s.getGender().equalsIgnoreCase(gender))
                    .toList();
        }
        if (grade != null && !grade.isEmpty()) {
            students = students.stream()
                    .filter(s -> s.getGrade().equalsIgnoreCase(grade))
                    .toList();
        }

        // Sorting
        if (sortBy != null && !sortBy.isEmpty()) {
            Comparator<Student> comparator = switch (sortBy.toLowerCase()) {
                case "name" -> Comparator.comparing(Student::getName);
                case "age" -> Comparator.comparing(Student::getAge);
                case "gender" -> Comparator.comparing(Student::getGender);
                case "grade" -> Comparator.comparing(Student::getGrade);
                default -> null;
            };

            if (comparator != null) {
                if ("desc".equalsIgnoreCase(direction)) {
                    comparator = comparator.reversed();
                }
                students = students.stream()
                        .sorted(comparator)
                        .toList();
            }
        }

        return students;
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