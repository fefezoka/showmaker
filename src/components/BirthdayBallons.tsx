import React from 'react';

export const BirthdayBallons = () => {
  const bdayBallons = (function () {
    const density = 4; // concurrent balloon count
    const balloons = [];
    const colors = ['yellow', 'green', 'blue', 'red', 'white', 'black'];

    const stringElement = document.createElement('div');
    stringElement.classList.add('string');

    for (let i = 0; i < density; i++) {
      const element = document.createElement('div');
      element.classList.add('balloon');
      element.classList.add(randomColor());

      element.append(stringElement.cloneNode());
      document.body.append(element);

      setTimeout(() => {
        releaseBalloon(element);
      }, i * 1000 + random(500, 1000));
    }

    function randomColor() {
      return colors[random(0, colors.length)];
    }

    function random(min: number, max: number) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function releaseBalloon(balloon: HTMLDivElement) {
      const delay = random(100, 1000);
      const x = random(-99, -50); // random x value to fly
      const y = random(-99, -50); // random y value to fly

      const sequence = [
        {
          offset: 0,
          transform: `rotateZ(45deg) translate(0, 0)`,
        },
      ];

      // random fly direction
      if (random(0, 2) === 0) {
        // first fly up to top left

        // left distance to keep balloon in view
        balloon.style.left = `${-1 * x}vw`;

        sequence.push({
          offset: x / -200,
          transform: `rotateZ(45deg) translate(${x}vw, 0)`,
        });
        sequence.push({
          offset: (x + y) / -200,
          transform: `rotateZ(45deg) translate(${x}vw, ${y}vh)`,
        });
        sequence.push({
          offset: (-100 + y) / -200,
          transform: `rotateZ(45deg) translate(-100vw, ${y}vh)`,
        });
      } else {
        // fist fly up to right top

        sequence.push({
          offset: y / -200,
          transform: `rotateZ(45deg) translate(0, ${y}vh)`,
        });
        sequence.push({
          offset: (x + y) / -200,
          transform: `rotateZ(45deg) translate(${x}vw, ${y}vh)`,
        });
        sequence.push({
          offset: (-100 + x) / -200,
          transform: `rotateZ(45deg) translate(${x}vw, -100vh)`,
        });
      }

      // last move is common
      sequence.push({
        offset: 1,
        transform: `rotateZ(45deg) translate(-100vw, -100vh)`,
      });

      const balloonAnimation = balloon.animate(sequence, {
        duration: 10000,
        delay: delay,
      });
    }
  })();

  return <></>;
};
