if (typeof console.profile === 'function' && typeof console.profileEnd === 'function') {
    console.profile('Profile Name');
    // Your code for profiling here
    console.profileEnd();
} else {
    console.log('Profiling is not supported in this environment.');
}