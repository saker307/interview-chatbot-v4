// let audioChunks = [];

// document.addEventListener('DOMContentLoaded', function () {
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count'); // Updated to match HTML
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append('user_voice_responses', file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         // Fetch and append question texts to FormData
//         const questionTexts = await fetchQuestionTexts();
//         if (questionTexts.length !== maxRecordings) {
//             alert('Incorrect number of question texts. Expected 10.');
//             return;
//         }
//         questionTexts.forEach(text => {
//             formData.append('question_texts', text);
//         });

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(data => {
//                     throw new Error(data.message || 'Failed to submit the form');
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your score is: ' + data.total_score);
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });

// let audioChunks = [];

// document.addEventListener('DOMContentLoaded', function () {
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('question-display'); // New element for displaying questions
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append('user_voice_responses', file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                 }

//                 // Move to the next question after recording
//                 displayNextQuestion();
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(data => {
//                     throw new Error(data.message || 'Failed to submit the form');
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your score is: ' + data.total_score);
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });



// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append('user_voice_responses', file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(data => {
//                     throw new Error(data.message || 'Failed to submit the form');
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your score is: ' + data.total_score);
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });

// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(data => {
//                     throw new Error(data.message || 'Failed to submit the form');
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your score is: ' + data.total_score);
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });


// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(data => {
//                     throw new Error(data.message || 'Failed to submit the form');
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your score is: ' + data.total_score);
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });


// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => {
//                     throw new Error(`Server returned an error: ${text}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your score is: ' + data.total_score);
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });



// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => {
//                     throw new Error(`Server returned an error: ${text}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your score is: ' + data.total_score);
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });

// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit-response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => {
//                     throw new Error(`Server returned an error: ${text}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your score is: ' + data.total_score);
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });

// let audioChunks = [];

// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit-response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => {
//                     throw new Error(`Server returned an error: ${text}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your scores are: ' + data.scores.join(', '));
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });



// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit-response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => {
//                     throw new Error(`Server returned an error: ${text}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your scores are: ' + data.scores.join(', '));
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });


// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record all responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sectionSelect.innerHTML = ''; // Clear previous options
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'You have completed all questions.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit-response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => {
//                     throw new Error(`Server returned an error: ${text}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your scores are: ' + data.scores.join(', '));

//             // Reset form and state after successful submission
//             resetForm();
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }

//     function resetForm() {
//         formData = new FormData(); // Reset FormData
//         currentRecordingCount = 0; // Reset count
//         recordingCounter.textContent = `0/${maxRecordings}`; // Reset recording count display
//         questionDisplay.textContent = ''; // Clear the question display
//         startButton.disabled = false;
//         stopButton.disabled = true;
//         uploadForm.querySelector('button[type="submit"]').disabled = true;
//     }
// });


// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => {
//                     throw new Error(`Server returned an error: ${text}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your score is: ' + data.total_score);
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });



// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch sections');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 populateSectionsDropdown(data.sections);
//             })
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch questions');
//             }
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.text().then(text => {
//                     throw new Error(`Server returned an error: ${text}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             alert('Submission successful! Your scores are: ' + data.scores.join(', '));
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });






// document.addEventListener('DOMContentLoaded', function () {
//     let audioChunks = [];
//     let mediaRecorder;
//     const startButton = document.getElementById('start-recording');
//     const stopButton = document.getElementById('stop-recording');
//     const audioPlayback = document.getElementById('audio-playback');
//     const sectionSelect = document.getElementById('section-select');
//     const uploadForm = document.getElementById('upload-form');
//     const recordingCounter = document.getElementById('recording-count');
//     const questionDisplay = document.getElementById('current-question');
//     const sectionInput = document.getElementById('section-input');
//     const audioFileInputs = document.getElementById('audio-file-inputs');
//     const maxRecordings = 10;
//     let currentRecordingCount = 0;
//     let formData = new FormData();
//     let questionTexts = [];
//     let currentQuestionIndex = 0;

//     // Fetch and populate the sections dropdown on page load
//     fetchSections();

//     // Start recording
//     startButton.addEventListener('click', async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder = new MediaRecorder(stream);

//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };

//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 audioPlayback.src = audioUrl;

//                 const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

//                 // Append the file to FormData
//                 formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

//                 // Update hidden inputs with base64 encoded data for audio files
//                 const fileReader = new FileReader();
//                 fileReader.onload = function () {
//                     const base64Data = fileReader.result.split(',')[1];
//                     audioFileInputs.value += base64Data + ',';
//                 };
//                 fileReader.readAsDataURL(file);

//                 audioChunks = [];
//                 currentRecordingCount++;
//                 recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

//                 if (currentRecordingCount >= maxRecordings) {
//                     startButton.disabled = true;
//                     stopButton.disabled = true;
//                     uploadForm.querySelector('button[type="submit"]').disabled = false;
//                 } else {
//                     // Move to the next question after recording
//                     displayNextQuestion();
//                 }
//             };

//             mediaRecorder.start();
//             startButton.disabled = true;
//             stopButton.disabled = false;
//         } catch (err) {
//             console.error('Error accessing microphone:', err);
//             alert('Error accessing microphone. Please check your permissions.');
//         }
//     });

//     // Stop recording
//     stopButton.addEventListener('click', () => {
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//             startButton.disabled = false;
//             stopButton.disabled = true;
//         }
//     });

//     // Submit form
//     uploadForm.addEventListener('submit', async function (event) {
//         event.preventDefault();

//         if (currentRecordingCount < maxRecordings) {
//             alert('Please record 10 responses before submitting.');
//             return;
//         }

//         const section = sectionSelect.value;
//         if (!section) {
//             alert('Please select a section before submitting.');
//             return;
//         }

//         // Append section to FormData
//         formData.append('section', section);

//         console.log('Form Data:', ...formData.entries());

//         submitForm(formData);
//     });

//     function fetchSections() {
//         fetch('/chatbot/sections/')
//             .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch sections'))
//             .then(data => populateSectionsDropdown(data.sections))
//             .catch(error => {
//                 console.error('Error fetching sections:', error);
//                 alert('Error fetching sections. Please try again later.');
//             });
//     }

//     function populateSectionsDropdown(sections) {
//         sections.forEach(section => {
//             const option = document.createElement('option');
//             option.value = section;
//             option.textContent = section;
//             sectionSelect.appendChild(option);
//         });
//     }

//     async function fetchQuestionTexts() {
//         const section = sectionSelect.value;
//         if (!section) return [];

//         try {
//             const response = await fetch(`/chatbot/questions/?section=${section}`);
//             if (!response.ok) throw new Error('Failed to fetch questions');
//             const data = await response.json();
//             return data.questions.map(question => question.text);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions. Please try again later.');
//             return [];
//         }
//     }

//     // Display the next question
//     function displayNextQuestion() {
//         if (currentQuestionIndex < questionTexts.length) {
//             questionDisplay.textContent = questionTexts[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             questionDisplay.textContent = 'All questions completed.';
//         }
//     }

//     // Fetch questions when a section is selected
//     sectionSelect.addEventListener('change', async () => {
//         questionTexts = await fetchQuestionTexts();
//         currentQuestionIndex = 0;
//         displayNextQuestion();
//         // Update the hidden section input field
//         sectionInput.value = sectionSelect.value;
//     });

//     function submitForm(formData) {
//         fetch('/chatbot/submit_response/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
//             }
//         })
//         .then(response => response.ok ? response.json() : response.text().then(text => Promise.reject(`Server returned an error: ${text}`)))
//         .then(data => {
//             alert('Submission successful! Your scores are: ' + data.scores.join(', '));
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//             alert('Error: ' + error.message);
//         });
//     }
// });




document.addEventListener('DOMContentLoaded', function () {
    let audioChunks = [];
    let mediaRecorder;
    const startButton = document.getElementById('start-recording');
    const stopButton = document.getElementById('stop-recording');
    const audioPlayback = document.getElementById('audio-playback');
    const sectionSelect = document.getElementById('section-select');
    const uploadForm = document.getElementById('upload-form');
    const recordingCounter = document.getElementById('recording-count');
    const questionDisplay = document.getElementById('current-question');
    const sectionInput = document.getElementById('section-input');
    const audioFileInputs = document.getElementById('audio-file-inputs');
    const maxRecordings = 10;
    let currentRecordingCount = 0;
    let formData = new FormData();
    let questionTexts = [];
    let currentQuestionIndex = 0;

    fetchSections();

    startButton.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioUrl;

                const file = new File([audioBlob], `voice_response_${currentRecordingCount + 1}.wav`, { type: 'audio/wav' });

                formData.append(`user_voice_response_${currentRecordingCount + 1}`, file);

                const fileReader = new FileReader();
                fileReader.onload = function () {
                    const base64Data = fileReader.result.split(',')[1];
                    audioFileInputs.value += base64Data + ',';
                };
                fileReader.readAsDataURL(file);

                audioChunks = [];
                currentRecordingCount++;
                recordingCounter.textContent = `Recordings: ${currentRecordingCount}/${maxRecordings}`;

                if (currentRecordingCount >= maxRecordings) {
                    startButton.disabled = true;
                    stopButton.disabled = true;
                    uploadForm.querySelector('button[type="submit"]').disabled = false;
                } else {
                    displayNextQuestion();
                }
            };

            mediaRecorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Error accessing microphone. Please check your permissions.');
        }
    });

    stopButton.addEventListener('click', () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    });

    uploadForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (currentRecordingCount < maxRecordings) {
            alert('Please record 10 responses before submitting.');
            return;
        }

        const section = sectionSelect.value;
        if (!section) {
            alert('Please select a section before submitting.');
            return;
        }

        formData.append('section', section);

        console.log('Form Data before submit:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        submitForm(formData);
    });

    function fetchSections() {
        fetch('/chatbot/sections/')
            .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch sections'))
            .then(data => populateSectionsDropdown(data.sections))
            .catch(error => {
                console.error('Error fetching sections:', error);
                alert('Error fetching sections. Please try again later.');
            });
    }

    function populateSectionsDropdown(sections) {
        sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            sectionSelect.appendChild(option);
        });
    }

    async function fetchQuestionTexts() {
        const section = sectionSelect.value;
        if (!section) return [];

        try {
            const response = await fetch(`/chatbot/questions/?section=${section}`);
            if (!response.ok) throw new Error('Failed to fetch questions');
            const data = await response.json();
            return data.questions.map(question => question.text);
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Error fetching questions. Please try again later.');
            return [];
        }
    }

    function displayNextQuestion() {
        if (currentQuestionIndex < questionTexts.length) {
            questionDisplay.textContent = questionTexts[currentQuestionIndex];
            currentQuestionIndex++;
        } else {
            questionDisplay.textContent = 'All questions completed.';
        }
    }

    sectionSelect.addEventListener('change', async () => {
        questionTexts = await fetchQuestionTexts();
        currentQuestionIndex = 0;
        displayNextQuestion();
        sectionInput.value = sectionSelect.value;
    });

    function submitForm(formData) {
        fetch('/chatbot/submit_response/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.ok ? response.json() : response.text().then(text => Promise.reject(`Server returned an error: ${text}`)))
        .then(data => {
            alert('Submission successful! Your scores are: ' + data.scores.join(', '));
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('Error: ' + error.message);
        });
    }
});
