module.exports = {
  cookie: 'JSESSIONID',
  server: {
    main: 'http://167.86.91.120:8081',
    login: '/api/v1/login',  
    sr: '/api/v1/sr', 
    user: '/api/v1/users',
  },
  queryParams: {
    fields: '?fields=title,description,problem_type,problem_sub_type,third_level_category,insert_time,close_time,assigned_group,status,CustomColumn6sr,request_user,priority,notes,cust_notes&assigned_group=1',
  },
  user_name: '.\\sysaid',
  password: 'power@sysaid',  
  fields: {
    issueId: 'CustomColumn6sr',
    issueIdDatabase: 'sr_cust_redmine_id',
  }
}