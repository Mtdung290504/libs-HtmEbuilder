// Create a new div element
const divBuilder = HtmEBuilder.generate('div')
    .id('demoDiv')
    .class('red', 'bold')
    .text('This is a demo div')
    .pushHtml('<p>This is additional inner HTML</p>')
    .style({ backgroundColor: '#444', padding: '10px' })
    .on('click', () => {
        lg('Div clicked!');
    }, 'log-click')
    .on('click', () => {
        divBuilder.tgClass('blue');
    }, 'change-color')
    // Create a child element within a child
    .append(
        HtmEBuilder.generate('div')
            .class('child-div')
            .text('I am a child div')
            .el
    )
    // Append child to specific child element
    .childAppend('.child-div', 
        HtmEBuilder.generate('span')
            .text('I am a child span inside child div')
            .el
    )
    .attachToEleHas('#container');

// Create and add an image
const imgBuilder = HtmEBuilder.generate('img')
    .attr('alt', 'Demo Image')
    .src('https://via.placeholder.com/150')
    .style({ display: 'block', margin: '10px 0' })
    .attachToEle(divBuilder.el);

// Create and add an anchor element
const anchorBuilder = HtmEBuilder.generate('a')
    .href('https://example.com')
    .text('Go to Example')
    .style({ display: 'block', margin: '10px 0', color: 'white' })
    .attachToEle(divBuilder.el);

// Create an audio element and add a source
const audioBuilder = HtmEBuilder.generate('audio')
    .source('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
    .attr('controls', '')
    .attachToEle(divBuilder.el);

// Create a video element and add a source
const videoBuilder = HtmEBuilder.generate('video')
    .source('https://www.w3schools.com/html/mov_bbb.mp4')
    .attr('controls', '')
    .style({ display: 'block', margin: '10px 0' })
    .attachToEle(divBuilder.el);

// Create a button to remove event listener
const buttonBuilder = HtmEBuilder.generate('button')
    .text('Remove Change Color Click Event')
    .on('click', () => {
        divBuilder.rmOn('click', 'change-color');
        alert('Click to change text color event removed from div');
    })
    .attachToEle(divBuilder.el);

// Create an instance from an existing element
const existingElement = HtmEBuilder.fromChildOf(dQs('#container'), '#demoDiv');
lg(existingElement.el);