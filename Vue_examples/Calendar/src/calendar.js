var cal = new Vue({
   el: '#calendar',
   data: {
       new_user_id: "",

       new_meeting_id: "",
       new_meeting_date: null,
       new_meeting_start_time: null,
       new_meeting_end_time: null,

       selectedperson: "",
       personalmeetings: [
           {
               id: "First person",
               pmeeting: [], 
           },
           {
               id: "Second person",
               pmeeting: [],
           }
        ]
   },
   methods: {
       getpersonalmeetings: function() {
            var selectedperson = this.getselectedperson();
            
            if (selectedperson != null)
                return selectedperson.pmeeting;
       },
       getselectedperson: function() {
           for (var i = 0; i < this.personalmeetings.length; i++)
           {
               if (this.personalmeetings[i].id == this.selectedperson) {
                   return this.personalmeetings[i];
               }
           }
       },
       addpersonalmeeting: function() {
           var user = this.getselectedperson();
           
            user.pmeeting.push({
            name: this.new_meeting_id,
            date: this.new_meeting_date,
            start_time: this.new_meeting_start_time,
            end_time: this.new_meeting_end_time,
            });

            this.new_meeting_id = ""
            this.new_meeting_date = null
            this.new_meeting_start_time = null
            this.new_meeting_end_time = null
       },
       deletepersonalmeeting: function(deletedmeeting) {
           var user = this.getselectedperson();
           user.pmeetings.splice(user.pmeetings.indexOf(deletemeeting), 1)
       },
       addnewuser: function() {
           this.personalmeetings.push({
               id: this.new_user_id,
               pmeeting: []
           });

           this.new_user_id = "";
       },
       deleteselecteduser: function() {
           var user = this.getselectedperson();
           selectedperson = "";
           this.personalmeetings.splice(this.personalmeetings.indexOf(user), 1);
       },
   },

});

