// src/main/java/com/younged/service/StudentService.java
package com.younged.service;

import com.younged.model.Student;
import java.util.List;

public interface StudentService {
    Student save(Student student);
    List<Student> getAllFilteredAndSorted(String name, Integer age, String gender, String grade, String sortBy, String direction);
    Student update(Long id, Student student);
    void delete(Long id);
}