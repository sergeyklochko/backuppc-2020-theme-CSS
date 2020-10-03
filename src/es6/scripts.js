/* global $ */
'use strict'

var menu = new Vue({
  el: 'header',
  data: {
    showMenu: false,
  },
  methods: {
    turnOnMenu(){
      this.showMenu = true
    },
    turnOffMenu() {
      this.showMenu = false
    },
  }
});


var totop = new Vue({
  el: '.totop',
  data: {
    showtotop: false
  },
  created() {
    window.addEventListener('scroll', this.onScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll() {
      this.showtotop = window.pageYOffset > 300;
    },
  },
});

var animationdrop = new Vue({
  el: '.animatoiondrop',
  data: {
    show: false
  },
  created() {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('DOMContentLoaded', this.onScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll() {
      if(this.show == false)
        this.show = (window.outerHeight + window.pageYOffset) > this.$el.scrollHeight + 200;
    },
  },
});

function _cons(...a){
  console.log(a)
}
