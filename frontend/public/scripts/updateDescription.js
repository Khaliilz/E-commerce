document.addEventListener('DOMContentLoaded', async function() {
    const editProfileForm = document.getElementById('editProfileForm');
    const textAreaDescription = document.getElementById('descriptionText');
    const saveButton = document.getElementById('submitDescription');

    try {
        // Get current description
        const response = await fetch('http://localhost:3000/api/v1/user/description', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });
                
        if (response.ok) {
            const responseData = await response.json();
            
            // Check if user has a description
            if (responseData.data.users && responseData.data.users.length > 0) {
                const user = responseData.data.users[0];
                textAreaDescription.value = user.description || '';
            }
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
    
    // Handle form submission
    if (saveButton) {
        saveButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const description = textAreaDescription.value;

            try {
                const response = await fetch('http://localhost:3000/api/v1/user/editDescription', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        description
                    })
                });
                
                if (response.ok) {
                    const responseData = await response.json();
                    window.location.href = 'editProfile.html';
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Failed to update description');
                }
            } catch (error) {
                console.error('Update error:', error);
                alert('An error occurred while updating your description');
            }
        });
    }
});