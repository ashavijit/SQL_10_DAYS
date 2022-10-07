# SQL_10_DAYS

This repository contains the solutions to the 10 days of SQL challenge on Leetcode.


## Day 1: Select

### Question 1: [Reformat Department Table](https://leetcode.com/problems/reformat-department-table/)

```sql
SELECT id, employee_name, department, salary
FROM
(SELECT id, employee_name, department_id, salary
FROM Employee) AS t1
LEFT JOIN
(SELECT department_id, department
FROM Department) AS t2
ON t1.department_id = t2.department_id
```
    