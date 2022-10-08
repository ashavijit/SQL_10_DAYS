select employee_id,
case
 when employee_id%2=0 or name like 'M%' then 0
 else salary

 end as bonus from Employees
 order by employee_id

-- Language: sql
-- Author Avijit Sen