// Toggles 'Find out more' boxes

console.log('Debugging toggle-find-out-more.js');

// Do the toggling
function toggleFindOutMore(event) {

    if (event.target && event.target.classList.contains('toggle')) {

        // Get the content walking up the tree from the a.toggle
        var findOutMoreBoxContent = event.target.parentNode.parentNode.parentNode.querySelectorAll('h3 ~ *, h4 ~ *, h5 ~ *, h6 ~ *');

        if (event.target.classList.contains('closed')) {
            event.target.classList.remove('closed');
            event.target.classList.add('open');
            for (var k = 0; k < findOutMoreBoxContent.length; k++) {
                findOutMoreBoxContent[k].classList.remove('visuallyhidden');
                console.log('Box opened: ' + findOutMoreBoxContent[k].parentNode.innerText.substring(40,length).replace(/\s\s+/g, ' ') + '...');
            }
        } else {
            event.target.classList.remove('open');
            event.target.classList.add('closed');
            for (var k = 0; k < findOutMoreBoxContent.length; k++) {
                findOutMoreBoxContent[k].classList.add('visuallyhidden');
                console.log('Box closed: ' + findOutMoreBoxContent[k].parentNode.innerText.substring(40,length).replace(/\s\s+/g, ' ') + '...');
            }
        };
    };
};

// Add toggle button to `.find-out-more strong`
function addBoxToggle(box) {

    console.log('Adding box toggle to ' + box.innerText.substring(40,length).replace(/\s\s+/g, ' ') + '...');

    // Get the h3 strong 'FIND OUT MORE' header
    var boxHeader = box.querySelector('h3 strong, h4 strong, h5 strong, h6 strong');

    // Add the toggle button
    var boxToggleButton = document.createElement('a');
    boxToggleButton.classList.add('toggle', 'closed');

    // Insert the button after the header
    boxHeader.insertAdjacentElement('beforeEnd', boxToggleButton);

    // Listen for clicks on .toggle.
    // Remember that accordion.js is listening for clicks, too,
    // currently on #content a, [data-accordion] (i.e. h2s), and #nav [href].
    boxHeader.querySelector('.toggle').addEventListener('click', toggleFindOutMore, true);

}

// Hide the contents of each box and add toggle
function processFindOutMoreBoxes() {
    var findOutMoreBoxes = document.querySelectorAll('.find-out-more');
    for (i = 0; i < findOutMoreBoxes.length; i++) {

        // Hide content
        var findOutMoreBoxContent = findOutMoreBoxes[i].querySelectorAll('h3 ~ *, h4 ~ *, h5 ~ *, h6 ~ *');

        for (var j = 0; j < findOutMoreBoxContent.length; j++) {

            console.log('Hiding ' + findOutMoreBoxContent[j].innerText.substring(20,length).replace(/\s\s+/g, ' ') + '...');

            findOutMoreBoxContent[j].classList.add('visuallyhidden');

            console.log('Now hidden: ' + findOutMoreBoxContent[j].innerText.substring(20,length).replace(/\s\s+/g, ' ') + '...');
        }

        // Add the toggle
        addBoxToggle(findOutMoreBoxes[i]);
    };
};

// Only run all this once the MathJax is typeset.
// Otherwise, MathJaxDisplay divs will appear after
// the find-out-more contents have been hidden.
MathJax.Hub.Register.StartupHook("End",function () {
    processFindOutMoreBoxes();
});
