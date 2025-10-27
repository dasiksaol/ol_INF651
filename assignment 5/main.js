const nameInput = document.getElementById("nameInput");
const submitButton = document.getElementById("submitButton");
const outputDiv = document.getElementById("outputDiv");
const mouseTracker = document.getElementById("mouseTracker");
const coordinatesDiv = document.getElementById("coordinates");

// click event
submitButton.addEventListener("click", () => {
  const name = nameInput.value.trim(); // remove whitespace

  if (name === "") {
    outputDiv.textContent = "Error: Please enter a name.";
    outputDiv.style.color = "red";
    outputDiv.style.backgroundColor = "transparent";
  } 
  else {
    outputDiv.textContent = `Welcome, ${name}!`;
    outputDiv.style.color = "white";
    outputDiv.style.backgroundColor = "green";
  }
}
);

// keyboard event (enter)
nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {  
    event.preventDefault(); // prevent page reload
    submitButton.click(); // call click submit button function
  }
}
);

// mouse event (track coordinates)
mouseTracker.addEventListener("mousemove", (event) => {
  const rect = mouseTracker.getBoundingClientRect();
  const x = Math.floor(event.clientX - rect.left);
  const y = Math.floor(event.clientY - rect.top);

  coordinatesDiv.textContent = `Mouse Coordinates: X: ${x}, Y: ${y}`;
}
);

mouseTracker.addEventListener("mouseleave", () => {
  coordinatesDiv.textContent = "Mouse Coordinates: X: 0, Y: 0";
}
);
