Meteor.startup(function(){
    process.env.MAIL_URL = Configuration.mailUrl;

    Accounts.emailTemplates.siteName = "Sentinel";
    Accounts.emailTemplates.from = Configuration.mailFrom;
    Accounts.emailTemplates.enrollAccount.subject = function (user) {
        return "Welcome to Sentinel";
    };
    Accounts.emailTemplates.enrollAccount.text = function (user, url) {
        return "You have joined the collective!"
            + " To activate your account, simply click the link below:\n\n"
            + url;
    };

    Accounts.emailTemplates.resetPassword.subject = function (user) {
        return "Reset password For Sentinel";
    };

    Accounts.emailTemplates.resetPassword.text = function (user, url) {
        return "To reset your account, simply click the link below:\n\n"
            + url;
    };
});
