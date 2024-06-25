// Builder have two types, first type is create for an existed element, example
const bodyB = HtmEBuilder.fromElement(document.body)
    .class('body')
    .style({
        margin: 0,
        height: '100dvh',
        background: '#333'
    })
    .on('dragstart', (ev) => {
        ev.preventDefault();
    })
    .on('click', (ev) => {
        if(ev.target.classList.contains('body'))
            navB.style({ transform: 'translateX(-100%)' })
    });

// Second type is create new element
// This variable is builder, you can use it to set style, attribute, html, listener,...
const openBtnB = new HtmEBuilder('button')
    .class('open-btn', 'btn')
    .rmClass('btn')
    .attr('g', 'gg')
    .rmAttr('g', 'gg')
    .style({
        marginRight: '10px',
        cursor: 'pointer'
    })
    .innerHTML('&#9776;')
    .on('click', () => {
        navB.style({ transform: 'translateX(0)' })
    })
    .on('animationcancel', () => {
        //...
    })
    
// Example, you can use builder variable again to set style, attribute, html, listener,...
openBtnB
    .attr('key', 'value')
    .on('mousedown', () => lg('mouse down'))
    .style({
        padding: '10px',
        aspectRatio: '1',
        background: '#333',
        color: 'white',
        transform: 'scaleX(1.3)'
    })

// If you want to take element
const openBtn = openBtnB.el;

const headerB = new HtmEBuilder('header')
    .class('header')
    .style({
        display: 'flex',
        alignItems: 'center',
        padding: '10px 30px',
        background: 'black',
        color: 'white',
    })
    .append(openBtnB.el)
    .append(
        new HtmEBuilder('h2')
        .append(
            new HtmEBuilder('a')
                .href('./demo.html')
                .textContent('Header')
                .style({
                    color: 'white',
                    textDecoration: 'none'
                })
                .el
        )
        .el
    )
    .attachTo(bodyB.el);

const navB = new HtmEBuilder('nav')
    .class('nav')
    .style({
        position: 'absolute',
        transition: '.3s',
        width: '25%',
        top: 0,
        left: 0,
        height: '100%',
        background: '#111',
        transform: 'translateX(-100%)'
    })
    .append(
        new HtmEBuilder('h2')
            .style({
                width: '100%',
                textAlign: 'center',
                color: 'white'
            })
            .textContent('Nav')
            .el
    )
    .attachTo(bodyB.el);