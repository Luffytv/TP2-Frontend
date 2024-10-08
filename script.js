const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');
const viewUsersButton = document.getElementById('viewUsersButton'); // Botón para ver usuarios

let currentUserId = null; // Para almacenar el ID del usuario que se está editando

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const dni = document.getElementById('dni').value;

    if (currentUserId) {
        // Actualizar usuario existente
        const response = await fetch(`http://localhost:3000/api/commands/user/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, dni }),
        });

        if (response.ok) {
            currentUserId = null; // Reiniciar ID del usuario actual
            userForm.reset();
        } else {
            alert('Error al actualizar usuario');
        }
    } else {
        // Crear nuevo usuario
        const response = await fetch('http://localhost:3000/api/commands/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, dni }),
        });

        if (response.ok) {
            userForm.reset();
        } else {
            alert('Error al agregar usuario');
        }
    }
});

// Botón para ver usuarios existentes
viewUsersButton.addEventListener('click', fetchUsers);

async function fetchUsers() {
    const response = await fetch('http://localhost:3000/api/queries/users');
    const users = await response.json();
    userList.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.username} - ${user.email} - ${user.dni}`;

        // Botón para editar usuario
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editUser(user._id, user.username, user.email, user.dni);
        li.appendChild(editButton);

        // Botón para eliminar usuario
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => deleteUser(user._id);
        li.appendChild(deleteButton);

        userList.appendChild(li);
    });
}

function editUser(id, username, email, dni) {
    currentUserId = id; // Guardar el ID del usuario
    document.getElementById('username').value = username;
    document.getElementById('email').value = email;
    document.getElementById('dni').value = dni;
}

// Función para eliminar usuario
async function deleteUser(id) {
    const response = await fetch(`http://localhost:3000/api/commands/user/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        fetchUsers(); // Refrescar la lista de usuarios después de eliminar
    } else {
        alert('Error al eliminar usuario');
    }
}