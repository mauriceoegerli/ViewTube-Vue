<template>
  <nuxt-link class="logo-link" to="/">
    <h1 class="logo">
      <span>View</span>
      <span class="logo-colored">Tube</span>
    </h1>
    <img class="logo-small" src="~/assets/icon.svg" alt="ViewTube" />
  </nuxt-link>
</template>

<style lang="scss">
.logo-link {
  text-decoration: none;
  margin: auto 10px auto 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  position: relative;
  z-index: +1;

  .logo {
    font-family: variables.$header-font;
    font-size: 1.5rem;
    color: var(--title-color);
    width: auto;
    overflow: hidden;
    white-space: nowrap;
    transition: width 300ms linear;
    display: flex;
    margin: 4px 0 0 0;

    span {
      display: block;
    }

    .logo-colored {
      color: transparent;
      background-image: var(--theme-color-gradient);
      background-clip: text;
      -webkit-background-clip: text;
    }
  }

  .logo-small {
    margin: auto;
    height: calc(#{variables.$header-height} - 20px);
    transform: scale(0.8) translateY(-2px);
    transition:
      clip-path 300ms variables.$intro-easing,
      transform 300ms linear;
  }
}
</style>
