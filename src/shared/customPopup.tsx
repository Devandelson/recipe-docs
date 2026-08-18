import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
    toast: true,
    position: 'top-end', // Options: 'top-start', 'top-end', 'bottom-start', 'bottom-end', etc.
    showConfirmButton: false,
    timer: 3000, // Time in milliseconds before auto-dismissing
    timerProgressBar: true,
    backdrop: false, // Prevents blocking page interaction
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});