console.log("GymForge JavaScript loaded successfully!");

let todoList = [];
let workoutCount = 0;
let gymStats = {
    workoutsThisWeek: 0,
    totalExercises: 24,
    currentWeight: 70,
    targetWeight: 75,
    gymExperience: 1
};

function saveStats() {
    gymStats.workoutsThisWeek = parseInt(document.getElementById('workouts-count').value) || 0;
    gymStats.totalExercises = parseInt(document.getElementById('exercises-count').value) || 0;
    gymStats.currentWeight = parseFloat(document.getElementById('current-weight').value) || 0;
    gymStats.targetWeight = parseFloat(document.getElementById('target-weight').value) || 0;
    gymStats.gymExperience = parseFloat(document.getElementById('gym-experience').value) || 0;
    
    const saveBtn = document.querySelector('.btn-small');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
    }, 1500);
    
    console.log('Gym stats saved:', gymStats);
}

$(document).ready(function() {
    console.log("jQuery is ready!");
    initializeApp();
});

function initializeApp() {
    console.log("Initializing application...");
    loadGymStats();
    
    $('.muscle-card').on('click', function() {
        const $this = $(this);
        const $exerciseList = $this.find('.exercise-list');
        
        if ($exerciseList.is(':visible')) {
            $exerciseList.slideUp(300);
        } else {
            $exerciseList.slideDown(300);
            $this.addClass('highlight');
            
            setTimeout(() => {
                $this.removeClass('highlight');
            }, 500);
        }
    });
    
    setupDragAndDrop();
    setupFormValidation();
    
    $('.exercise-item').on('mouseover', function() {
        $(this).css('background-color', '#404040');
    }).on('mouseout', function() {
        $(this).css('background-color', '#333');
    });
    
    $('nav a').on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        if (target !== '#') {
            $('html, body').animate({
                scrollTop: $(target).offset().top - 40
            }, 800);
        }
    });
}

function loadGymStats() {
    document.getElementById('workouts-count').value = gymStats.workoutsThisWeek;
    document.getElementById('exercises-count').value = gymStats.totalExercises;
    document.getElementById('current-weight').value = gymStats.currentWeight;
    document.getElementById('target-weight').value = gymStats.targetWeight;
    document.getElementById('gym-experience').value = gymStats.gymExperience;
}

function setupDragAndDrop() {
    const exerciseItems = document.querySelectorAll('.exercise-item');
    const dayColumns = document.querySelectorAll('.day-column');
    
    exerciseItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.textContent);
            this.style.opacity = '0.5';
        });
        
        item.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
        });
    });
    
    dayColumns.forEach(column => {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', function(e) {
            this.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const exerciseName = e.dataTransfer.getData('text/plain');
            const exercisesContainer = this.querySelector('.exercises-container');
            
            const newExercise = document.createElement('div');
            newExercise.className = 'exercise-item';
            newExercise.textContent = exerciseName;
            newExercise.style.animation = 'fadeIn 0.5s ease';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.className = 'btn btn-danger';
            deleteBtn.style.marginLeft = '0.5rem';
            deleteBtn.style.padding = '0.2rem 0.5rem';
            deleteBtn.style.fontSize = '0.8rem';
            
            deleteBtn.addEventListener('click', function() {
                newExercise.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    newExercise.remove();
                    updateWorkoutCount();
                }, 300);
            });
            
            newExercise.appendChild(deleteBtn);
            exercisesContainer.appendChild(newExercise);
            
            updateWorkoutCount();
            console.log(`Added ${exerciseName} to ${this.dataset.day}`);
        });
    });
}

function updateWorkoutCount() {
    const scheduledExercises = document.querySelectorAll('.day-column .exercise-item');
    workoutCount = scheduledExercises.length;
    gymStats.workoutsThisWeek = workoutCount;
    document.getElementById('workouts-count').value = workoutCount;
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    
    if (text === '') {
        alert('Please enter a workout note!');
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    todoList.push(todo);
    input.value = '';
    renderTodoList();
    
    console.log('Added todo:', todo);
}

function renderTodoList() {
    const container = document.getElementById('todo-list');
    container.innerHTML = '';
    
    todoList.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        todoElement.innerHTML = `
            <span>${todo.text}</span>
            <div>
                <button class="btn" onclick="toggleTodo(${todo.id})" style="margin-right: 0.5rem; padding: 0.3rem 0.6rem; font-size: 0.8rem;">
                    ${todo.completed ? 'Undo' : 'Done'}
                </button>
                <button class="btn btn-danger" onclick="deleteTodo(${todo.id})" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">
                    Delete
                </button>
            </div>
        `;
        
        container.appendChild(todoElement);
    });
}

function toggleTodo(id) {
    const todo = todoList.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodoList();
        console.log('Toggled todo:', todo);
    }
}

function deleteTodo(id) {
    todoList = todoList.filter(t => t.id !== id);
    renderTodoList();
    console.log('Deleted todo with id:', id);
}

document.getElementById('todo-input').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function setupFormValidation() {
    const form = document.getElementById('registration-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    nameInput.addEventListener('keyup', function() {
        validateName();
    });
    
    emailInput.addEventListener('keyup', function() {
        validateEmail();
    });
    
    passwordInput.addEventListener('keyup', function() {
        validatePassword();
    });
    
    confirmPasswordInput.addEventListener('keyup', function() {
        validateConfirmPassword();
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isValid = validateName() && validateEmail() && validatePassword() && validateConfirmPassword();
        
        if (isValid) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Account created successfully! Welcome to GymForge!');
                form.reset();
                clearValidationMessages();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
            
            console.log('Form submitted successfully!');
        } else {
            console.log('Form validation failed');
        }
    });
    
    form.querySelector('button[type="reset"]').addEventListener('click', function() {
        setTimeout(() => {
            clearValidationMessages();
        }, 0);
    });
}

function validateName() {
    const nameInput = document.getElementById('name');
    const errorElement = document.getElementById('name-error');
    const name = nameInput.value.trim();
    
    if (name.length < 2) {
        showError(errorElement, 'Name must be at least 2 characters long');
        return false;
    }
    
    showSuccess(errorElement, 'Name looks good!');
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const errorElement = document.getElementById('email-error');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showError(errorElement, 'Please enter a valid email address');
        return false;
    }
    
    showSuccess(errorElement, 'Email looks good!');
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('password-error');
    const password = passwordInput.value;
    
    if (password.length < 6) {
        showError(errorElement, 'Password must be at least 6 characters long');
        return false;
    }
    
    showSuccess(errorElement, 'Password strength: Good');
    return true;
}

function validateConfirmPassword() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorElement = document.getElementById('confirm-password-error');
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (password !== confirmPassword) {
        showError(errorElement, 'Passwords do not match');
        return false;
    }
    
    if (confirmPassword.length > 0) {
        showSuccess(errorElement, 'Passwords match!');
    }
    return true;
}

function showError(element, message) {
    element.textContent = message;
    element.className = 'error-message';
}

function showSuccess(element, message) {
    element.textContent = message;
    element.className = 'success-message';
}

function clearValidationMessages() {
    const errorElements = document.querySelectorAll('.error-message, .success-message');
    errorElements.forEach(el => {
        el.textContent = '';
    });
}

$(document).ready(function() {
    $('main').hide().fadeIn(1000);
    
    $('.muscle-card').hover(
        function() {
            $(this).find('.muscle-icon').animate({
                fontSize: '3.5rem'
            }, 200);
        },
        function() {
            $(this).find('.muscle-icon').animate({
                fontSize: '3rem'
            }, 200);
        }
    );
    
    $('.btn').hover(
        function() {
            $(this).animate({
                opacity: 0.9
            }, 150);
        },
        function() {
            $(this).animate({
                opacity: 1
            }, 150);
        }
    );
    
    $('nav a').click(function() {
        $('nav a').removeClass('active');
        $(this).addClass('active');
        
        $(this).fadeOut(100).fadeIn(100);
    });
    
    $('input, select, textarea').focus(function() {
        $(this).animate({
            borderWidth: '2px'
        }, 200);
    }).blur(function() {
        $(this).animate({
            borderWidth: '1px'
        }, 200);
    });
    
    $('.exercise-item').click(function() {
        $(this).toggleClass('highlight');
        
        $(this).animate({
            transform: 'scale(1.05)'
        }, 100).animate({
            transform: 'scale(1)'
        }, 100);
    });
    
    $('.day-column').on('click', function() {
        const $this = $(this);
        const originalBg = $this.css('background-color');
        
        $this.animate({
            backgroundColor: 'rgba(0, 212, 170, 0.2)'
        }, 200).animate({
            backgroundColor: originalBg
        }, 200);
    });
    
    // Logo click effect
    $('.logo').click(function(e) {
        e.preventDefault();
        $(this).animate({
            fontSize: '2rem'
        }, 150).animate({
            fontSize: '1.8rem'
        }, 150);
        
        // Scroll to top smoothly
        $('html, body').animate({
            scrollTop: 0
        }, 800);
    });
    
    // Stats counter animation
    function animateCounter(element, target) {
        $({ counter: 0 }).animate({
            counter: target
        }, {
            duration: 1000,
            step: function() {
                $(element).text(Math.ceil(this.counter));
            }
        });
    }
    
    // Trigger counter animation on page load
    setTimeout(() => {
        animateCounter('#exercises-count', gymStats.totalExercises);
    }, 500);
});

// Additional utility functions
function changeTheme() {
    // Theme toggle functionality (could be extended)
    console.log('Theme change functionality');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + S to scroll to schedule
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $('#schedule').offset().top - 100
        }, 800);
    }

    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $('#muscle-groups').offset().top - 100
        }, 800);
    }
});

function debugWorkout() {
    console.log('Current workout state:');
    console.log('Todo list:', todoList);
    console.log('Workout count:', workoutCount);
    console.log('Gym stats:', gymStats);
}

window.debugWorkout = debugWorkout;

console.log('GymForge fully loaded! Use debugWorkout() to see current state.');
console.log('Keyboard shortcuts: Alt+S (schedule), Alt+M (muscle groups)');