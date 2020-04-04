var cal = new Vue ({
    el: '#calendar',
   data: {
       users: [
            {
                user_id: "First user",
                meetings: [],
            },
            {
                user_id: "Second user",
                meetings: [],
            }
       ],

       new_user_id: "",
       
       new_meeting_id: "",
       new_meeting_date: null,
       new_meeting_start_time: null,
       new_meeting_end_time: null,
       
       selectedperson: "",
    },
    methods: {
        getpersonalmeetings: function(userid) {
            var selecteduser = this.getselectedperson(userid);

            if (selecteduser != null)
                return selecteduser.meetings;
        },
        getselectedperson: function(userid) {
           for (var i = 0; i < this.users.length; i++)
           {
               if (this.users[i].user_id == userid) {
                   return this.users[i];
               }
           }
        },
        addpersonalmeeting: function(userid, newid, newdate, starttime, endtime) {
            this.getselectedperson(userid).meetings.push({
                name: newid,
                date: newdate,
                start_time: starttime,
                end_time: endtime,
            });
        },
        deletepersonalmeeting: function(userid, deletedmeeting) {
            var user = this.getselectedperson(userid);
            user.meetings.splice(user.meetings.indexOf(deletedmeeting), 1);
        },
        addnewuser: function(newuserid) {
           this.users.push({
               user_id: newuserid,
               meetings: []
           });
        },
        deleteselecteduser: function(deleteduserid) {
           this.users.splice(this.users.indexOf(this.getselectedperson(deleteduserid)), 1);
        },
   },
   
})
