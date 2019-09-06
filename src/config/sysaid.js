module.exports = {
  cookie: 'JSESSIONID',
  server: {
    main: 'http://167.86.91.120:8081',
    login: '/api/v1/login',  
    sr: '/api/v1/sr',
  },
  queryParams: {
    fields: '?fields=problem_type,problem_sub_type,third_level_category,insert_time,close_time,assigned_group',
  },
  user_name: '.\\sysaid',
  password: 'power@sysaid',  
}