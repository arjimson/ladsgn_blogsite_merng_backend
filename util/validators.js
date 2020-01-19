
module.exports.validateRegisterInput = (username, email, password, confirnPassword) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (email.trim() === '') {
        errors.email = 'Email must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Email must be a valid email address';
        }
    }
    if (confirnPassword === '') {
        errors.confirmPassword = 'Confirm Password must not be empty'
    }

    if (password === '') {
        errors.password = 'Password must not be empty'
    } else if (password !== confirnPassword) {
        errors.confirnPassword = 'Passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}



module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (password.trim() === '') {
        errors.password = 'Password must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validatePostInput = (body, filename) => {
    const errors = {};
    if (body.trim() === '') {
        errors.body = 'Post body must not be empty';
    }

    if (!filename) {
        errors.file = 'Image file must not be empty';
    }

    // if (postImagePath === '') {
    //     errors.postImagePath = 'Post Image Path must not be empty';
    // }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}