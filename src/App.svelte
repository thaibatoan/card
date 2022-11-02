<script lang="ts">
  import { flip } from 'svelte/animate';
  import { crossfade, fly } from 'svelte/transition';
  import StackedCards from './lib/StackedCards.svelte';
  import { randomInt, getCardNumberAndType } from './utils.ts';
  import { cards, cardsMap, cardTypes, cardTypesMap } from './constant.ts';
  import type { Card } from './constant.ts';

  const [send, receive] = crossfade({});

  let currentCards = randomHand();

  let playedCards: [{cards: Card[], rotation: number, x: number, y: number}] = [
    { cards: ['3♠️', '4♠️', '5♠️'], rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
    { cards: ['6♠️', '7♠️', '8♠️'], rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
    { cards: ['9♠️', '10♠️', 'J♠️'], rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
  ];

  function selectCard(card) {
    const selectedCard = currentCards.find((c) => c.card === card);
    selectedCard.selected = !selectedCard.selected;
    currentCards = [...currentCards];
  }

  let number = 0;

  let showHand = false;

  function sendCards() {
    const selectedCards = currentCards.filter(({ selected }) => selected).map(({ card }) => card);
    playedCards = [...playedCards, { cards: selectedCards, rotation: 0, x: 0, y: randomInt(-50, 50) }];
    currentCards = currentCards.filter(({ selected }) => !selected);
  }

  function dealCards() {
    if (showHand) {
      showHand = false;
      currentCards = randomHand();
      number = 0;
    } else {
      showHand = true;
      setTimeout(() => {
        currentCards = currentCards.sort(({ card: card1 }, { card: card2 }) => {
          const [number1, type1] = getCardNumberAndType(card1);
          const [number2, type2] = getCardNumberAndType(card2);
          console.log(type1, cardTypesMap[type1],  type2, cardTypesMap[type2])
          return cardsMap[number1] - cardsMap[number2] || cardTypesMap[type1] - cardTypesMap[type2];
        });
      }, 1800);

      const timer = setInterval(() => {
        number++;
        if (number >= 13) {
          clearInterval(timer);
          return;
        }
      }, 100);
    }
  }

  function randomHand() {
    const result = new Set<string>();

    while (result.size < 13) {
      const cardNumber = cards[randomInt(0, 12)];
      const cardType = cardTypes[randomInt(0, 3)];
      result.add(`${cardNumber}${cardType}`);
    }
    return [...result].map((card) => ({ card, selected: false }));
  }

  function isValid() {
    const selectedCards = currentCards.filter(({ selected }) => selected).map(({ card }) => card);
    if (playedCards.length > 0) {
      const lastCards = playedCards.at(-1).cards;
    }
  }
</script>

<main>
  <div style="display: flex; justify-content: space-between">
    <StackedCards {number} />
    <StackedCards {number} />
    <StackedCards {number} />
  </div>

  <div class="board" style="position: relative; height: 300px">
    {#each playedCards as { cards, rotation, x, y }}
      <div class="board-item" style="rotate: {rotation}deg; translate: {x}px {y}px">
        {#each cards as card}
          <div class="image">
            <img in:receive={{ key: card }} src="{card}.svg" class="logo" alt={card} />
          </div>
        {/each}
      </div>
    {/each}
  </div>

  {#if showHand}
    <div class="hand">
      {#each currentCards as { card, selected }, i (card)}
        <img
          in:fly={{ y: -50, duration: 500, delay: i * 100 }}
          out:send={{ key: card }}
          animate:flip={{ duration: 400 }}
          class:selected
          src="{card}.svg"
          class="logo"
          alt={card}
          on:click={() => selectCard(card)}
        />
      {/each}
    </div>
  {/if}

  <div style="padding: 2em">
    <button on:click={sendCards}>Send</button>
    <button on:click={dealCards}>Deal</button>
  </div>

  {#each cardTypes as cardType}
    <div>
      {#each cards as card}
        <img src="{card}{cardType}.svg" class="logo" alt={card} />
      {/each}
    </div>
  {/each}
</main>

<style>
  .logo {
    width: 5em;
    will-change: filter;
  }

  .board {
    display: grid;
    place-items: center;
    grid-template-columns: 1fr;
  }

  .board-item {
    grid-row-start: 1;
    grid-column-start: 1;
    display: flex;
    pointer-events: none;
  }

  .board-item .image {
    position: relative;
  }

  .board-item:not(:last-child) .image::after {
    position: absolute;
    content: '';
    background-color: black;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 10px;
    opacity: 50%;
  }

  .hand img+img {
    margin-left: -3.6em
  }
  .hand img.selected {
    translate: 0 -1.5em;
  }
  .hand img:hover {
    z-index: 99;
    position:relative;
    filter: drop-shadow(0 0 2em #646cffaa);
  }
</style>
