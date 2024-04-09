let api = 'get_setting.php';

const app = Vue.createApp({
  data() {
    return {
      isLoading: false,
      isLock: false,
      bar: 0,
      barVal: 0,
      preregGiftLink: false,
      user: {
        account: '',
        moblieArea: '+886',
        moblieNum: '',
        read: false,
        isReserve: 'N',
        attackNum: 0,
        attackVal1: '',
        attackVal2: '',
        totalAttack: 0,
      },
      currentBoss: 0,
      bossData: [
        {
          id: 1,
          name: '烯娜',
          hp: 100,
          img: './img/sec2/boss1.png',
          awardImg: './img/sec2/award1.png',
        },
        {
          id: 2,
          name: '炎魔',
          hp: 100,
          img: './img/sec2/boss2.png',
          awardImg: './img/sec2/award2.png',
        },
        {
          id: 3,
          name: '審判者',
          hp: 100,
          img: './img/sec2/boss3.png',
          awardImg: './img/sec2/award3.png',
        },
      ],
      isBossDone: false,
      watchWidth: false,
      swiper: null,
      activeSec: '',
      menuActive: false,
      pop: {
        type: '',
        openB: false,
        openS: false,
        mask: false,
        mask2: false,
        msg: '',
        btnType: '',
      },
      sec3Data: {
        D: [
          { id: 1, src: './img/sec3/1.png', alt: '強者之戰，誰與爭鋒' },
          { id: 2, src: './img/sec3/2.png', alt: '衝等拿獎勵' },
          { id: 3, src: './img/sec3/3.png', alt: '命運由你來掌控' },
          { id: 4, src: './img/sec3/4.png', alt: '賽季結束，角色轉移' },
        ],
        M: [
          { id: 1, src: './img/M/BN001.jpg', alt: '強者之戰，誰與爭鋒' },
          { id: 2, src: './img/M/BN002.jpg', alt: '衝等拿獎勵' },
          { id: 3, src: './img/M/BN003.jpg', alt: '命運由你來掌控' },
          { id: 4, src: './img/M/BN004.jpg', alt: '賽季結束，角色轉移' },
        ],
      },
      sec4Data: {
        currentTime: new Date(),
        targetTime: new Date('2024-01-22'),
        days: '',
        images: [
          {
            id: 1,
            src: './img/sec4/001.jpg',
            alt: '強化達人-強化贈永久技能武器，+7技能武器前三直接拿​',
            link: 'https://nage.digeam.com/2s_240201-2/',
          },
          {
            id: 2,
            src: './img/sec4/002.jpg',
            alt: '登入簽到禮​-超佛獎勵輕鬆領',
            link: 'https://nage.digeam.com/2s_240201-5/',
          },
          {
            id: 3,
            src: './img/sec4/003.jpg',
            alt: '王者聯盟-尋找N-age最強聯盟',
            link: 'https://nage.digeam.com/2s_240201-4/',
          },
          {
            id: 4,
            src: './img/sec4/004.jpg',
            alt: '衝榜勇者賞-衝榜勇者，限定加碼',
            link: 'https://nage.digeam.com/2s_240201/',
          },
          {
            id: 5,
            src: './img/sec4/005.jpg',
            alt: '沙漠征服者-異形入侵，急召勇者支援​',
            link: 'https://nage.digeam.com/2s_240201-3/',
          },
        ],
      },
    };
  },
  watch: {},
  methods: {
    checkCookie(name) {
      const cookies = document.cookie.split(';');
      const cookieName = `${name}=`;
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) == 0) {
          return cookie.substring(cookieName.length, cookie.length);
        }
      }
      return '';
    },
    loading() {
      let value = 0;
      const max = 100;
      let anim = setInterval(() => {
        if (value == max) {
          this.barVal = 'Nage all ready done!!';
          setTimeout(() => {
            clearInterval(anim);
            this.startFadeOut();
          }, 500);
        } else {
          value += 1;
          this.bar = value;
          this.barVal = value + '%';
        }
      }, 30);
    },
    startFadeOut() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
    async getSetting() {
      try {
        const res = await axios.post(api, {
          type: 'login',
          user: this.user.account,
        });
        if (res.data.status == 1) {
          this.user.attackNum = res.data.lastAttack;
          this.user.totalAttack = res.data.total;
          this.user.isReserve = res.data.isReserve;
        }

        if (res.data.id === 0) {
          this.currentBoss = -1;
          this.isBossDone = true;
          let attBtn = document.querySelector('.attack');
          let shareBtn = document.querySelector('.share');
          let boss = document.querySelector('.isBoss');
          boss.classList.add('done');
          attBtn.classList.add('done');
          shareBtn.classList.add('done');
        } else {
          this.currentBoss = res.data.id - 1;
        }

        let hp = document.querySelector('.hpBg');
        hp.style.width = res.data.hp + '%';
        return res;
      } catch (err) {
        console.error(err);
      } finally {
      }
    },
    updateReturnUrl() {
      var returnUrl = 'https://nage.digeam.com/event/20240111/';
      var encodedUrl = btoa(returnUrl);
      document.cookie =
        'return_url=' + encodedUrl + '; path=/; domain=.digeam.com; secure';
    },
    async resever() {
      let area = this.user.moblieArea;
      let mobile = this.user.moblieNum;
      let read = this.user.read;
      if (this.user.account == '') {
        this.popSmsg('login', -99);
        return;
      } else if (read == false) {
        this.popSmsg('reserve', -97);
        this.pop.btnType = 'close';
        return;
      } else if (
        area == '+886' &&
        mobile.length == 9 &&
        !isNaN(mobile) &&
        mobile.substring(0, 1) == 9
      ) {
      } else if (
        area == '+886' &&
        mobile.length == 10 &&
        !isNaN(mobile) &&
        mobile.substring(0, 1) == 0
      ) {
        this.user.moblieNum = mobile.substring(1, 11);
      } else if (
        (area == '+852' || area == '+853') &&
        mobile.length == 8 &&
        !isNaN(mobile)
      ) {
      } else {
        this.popSmsg('reserve', -98);
        return;
      }
      const TheVue = this;
      this.pop.mask2 = true;
      try {
        const res = await axios.post(api, {
          type: 'reserve',
          user: this.user.account,
          phone: this.user.moblieArea + this.user.moblieNum,
        });
        res.data.status == 1
          ? this.popSmsg('reserve', 1)
          : res.data.status == -99
          ? this.popSmsg('reserve', -99)
          : this.popSmsg('reserve', -98);
        res.data.status == 1 ? this.getSetting() : '';
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(function () {
          TheVue.pop.mask2 = false;
        }, 2000);
      }
    },
    playAttackEffect(type) {
      const critElement = this.$refs.critAttack;

      if (type == 'crit' && critElement) {
        critElement.classList.add('active');
        setTimeout(() => {
          critElement.classList.remove('active');
        }, 2000);
      } else {
        const normalElement = this.$refs.normalAttack;
        normalElement.classList.add('active');
        setTimeout(() => {
          normalElement.classList.remove('active');
        }, 500);
      }
    },
    bossShakeAndAttckVal(val) {
      const BossElement = this.$refs.bossShake;
      if (BossElement) {
        BossElement.classList.add('active');
        setTimeout(() => {
          BossElement.classList.remove('active');
        }, 2000);
      }

      if (val >= 999) {
        const critElement = this.$refs.critVal;
        if (critElement) {
          this.user.attackVal1 = '-' + val;
          critElement.classList.add('active');
          setTimeout(() => {
            critElement.classList.remove('active');
            this.user.attackVal1 = '';
          }, 2300);
        }
      } else {
        const normalElement = this.$refs.normalVal;
        if (normalElement) {
          this.user.attackVal2 = '-' + val;
          normalElement.classList.add('active');
          setTimeout(() => {
            normalElement.classList.remove('active');
            this.user.attackVal2 = '';
          }, 2300);
        }
      }
    },
    updateTotalAttack(total) {
      const totalElement = this.$refs.totalVal;
      if (totalElement) {
        this.user.totalAttack = total;
        totalElement.classList.add('active');
        setTimeout(() => {
          this.user.totalAttack = total;
          totalElement.classList.remove('active');
        }, 2300);
      }
    },
    async attack() {
      if (this.isBossDone == true) {
        return;
      }
      if (this.isLock == true || this.pop.mask2 == true) {
        return;
      }
      if (!this.user.account) {
        this.popSmsg('login', -99);
        return;
      }
      if (this.user.isReserve == 'N') {
        this.popSmsg('attack', -97);
        return;
      }

      const TheVue = this;
      this.pop.mask2 = true;
      this.isLock = true;

      try {
        const res = await axios.post(api, {
          type: 'attack',
          user: this.user.account,
          id: this.currentBoss + 1,
        });

        if (res.data.status == 1) {
          if (res.data.value >= 999) {
            this.playAttackEffect('crit');
            setTimeout(() => {
              this.bossShakeAndAttckVal(res.data.value);
              this.attackDataReceived = true;
              this.getSetting();
              setTimeout(() => {
                this.updateTotalAttack(res.data.total);
                this.getSetting();
              }, 500);
              this.getSetting();
            }, 1000);

            return;
          } else {
            this.updateTotalAttack(res.data.total);
            this.bossShakeAndAttckVal(res.data.value);
            this.playAttackEffect('normal');
            this.getSetting();
          }
        } else if (res.data.status == -99) {
          this.popSmsg('attack', -99);
        } else if (res.data.status == -98) {
          this.popSmsg('attack', -98);
        } else if (res.data.status == -97) {
          this.popSmsg('attack', -97);
        } else if (res.data.status == -96) {
          this.popSmsg('attack', -96);
          setTimeout(function () {
            TheVue.getSetting();
          }, 2000);
        } else if (res.data.status == -90) {
          this.popSmsg('attack', -90);
        }

        return res;
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(function () {
          TheVue.isLock = false;
          TheVue.pop.mask2 = false;
        }, 2000);
      }
    },
    fbAsyncInit() {
      FB.init({
        appId: '575812793509156',
        xfbml: true,
        version: 'v18.0',
      });
      FB.ui(
        {
          method: 'share',
          hashtag: '#Nage烈焰戰域賽季服登場',
          display: 'popup',
          href: 'https://nage.digeam.com/event/20240111/',
        },
        // callback
        function (response) {
          if (response && !response.error_message) {
            // alert('Posting completed.');
          } else {
            // alert('Error while posting.');
          }
        },
      );
    },
    async share() {
      if (this.isBossDone == true) {
        return;
      }

      if (this.user.account == '') {
        this.popSmsg('login', -99);
        return;
      }

      if (this.user.isReserve == 'N') {
        this.popSmsg('share', -97);
        return;
      }

      this.fbAsyncInit();

      const TheVue = this;
      this.pop.mask2 = true;
      try {
        const res = await axios.post(api, {
          type: 'share',
          user: this.user.account,
        });
        res.data.status == 1
          ? this.popSmsg('share', 1)
          : res.data.status == -99
          ? this.popSmsg('share', -99)
          : res.data.status == -98
          ? this.popSmsg('share', -98)
          : res.data.status == -97
          ? this.popSmsg('share', -97)
          : '';

        res.data.status == 1 ? this.getSetting() : '';
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(function () {
          TheVue.pop.mask2 = false;
        }, 2000);
      }
    },
    popSmsg(type, typeCode) {
      this.pop.openS = true;
      this.pop.mask = true;
      if (('login', -99)) {
        this.pop.msg = `請先登入`;
        this.pop.btnType = typeCode == 1 ? 'agree' : 'close';
      }
      if (type == 'reserve') {
        this.pop.msg =
          typeCode == 1
            ? `<span>新服預約成功！</span>`
            : typeCode == -99
            ? `此帳號已申請過新服預約！`
            : typeCode == -98
            ? `台灣區碼不含特殊符號的半形數字9碼​<br>港/澳區碼，不含特殊符號的半形數字8碼`
            : `請勾選同意事前登錄相關隱私權條款！`;
        this.pop.btnType = typeCode == 1 ? 'agree' : 'close';
      }
      if (type == 'share') {
        this.pop.msg =
          typeCode == 1
            ? `分享成功，已追加3次攻擊機會`
            : typeCode == -99
            ? `今日已分享過`
            : typeCode == -98
            ? `錯誤，請重新整理`
            : typeCode == -97
            ? `請先完成預約後分享！`
            : '';

        this.pop.btnType = typeCode == 1 ? 'agree' : 'close';
      }
      if (type == 'attack') {
        this.pop.msg =
          typeCode == 1
            ? ''
            : typeCode == -99
            ? `今日已無攻擊次數！`
            : typeCode == -98
            ? `錯誤，請重新整理`
            : typeCode == -97
            ? `請先完成預約後，再進行攻擊！`
            : typeCode == -96
            ? `怪物已全數討伐完畢！`
            : typeCode == -90
            ? `活動已結束！`
            : '';
        this.pop.btnType = typeCode == 1 ? 'agree' : 'close';
      }
    },
    popClose() {
      this.pop.openB = false;
      this.pop.openS = false;
      this.pop.mask = false;
    },
    popOpen(type) {
      this.pop.type = type;
      this.pop.openB = true;
      this.pop.mask = true;
    },
    initSwiper() {
      if (this.swiper) {
        this.swiper.destroy();
      }
      this.$nextTick(() => {
        this.swiper = new Swiper('.swiper', {
          slidesPerView: 1,
          spaceBetween: 24,
          centeredSlides: true,
          loop: true,
          speed: 1000,
          autoplay: true,
          disableOnInteraction: false,
          delay: 1000,
          // effect:'fade',
          breakpoints: {
            1920: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        });
      });
    },
    checkSec() {
      const sec = document.querySelectorAll('.sec');
      sec.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (window.scrollY < 100) {
          this.activeSec = '';
        }
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        ) {
          this.activeSec = sec.id;
        }
      });
    },
    toggleMenu() {
      this.menuActive = !this.menuActive;
    },
    popLink() {
      this.pop.openS = true;
      this.pop.mask = true;
      this.pop.msg = `後續開放`;
      this.pop.btnType = 'agree';
    },
  },
  mounted() {
    this.isLoading = true;
    this.loading();
    if (this.checkCookie('StrID')) {
      this.user.account = this.checkCookie('StrID');
    }
    this.getSetting();

    let width = window.innerWidth;
    let linkDate = new Date('2024-01-27 00:00:00').getTime();
    let now = new Date().getTime();
    const TheVue = this;

    window.onscroll = function () {
      var hideElement = document.querySelector('.aside');
      if (window.scrollY < 150 || window.scrollY >= 3200) {
        hideElement.style.opacity = '0';
      } else {
        hideElement.style.opacity = '1';
      }
      if (linkDate <= now) {
        TheVue.preregGiftLink = true;
        let preregElement = document.querySelector('.preregGift');
        if (width < 425 && window.scrollY > 300) {
          preregElement.style.opacity = '0';
        } else {
          preregElement.style.opacity = '1';
        }

        if (width < 500 && window.scrollY > 500) {
          preregElement.style.opacity = '0';
        } else {
          preregElement.style.opacity = '1';
        }
      }
    };

    if (width < 768) {
      this.watchWidth = true;
      this.initSwiper();
    } else {
      this.watchWidth = false;
      this.initSwiper();
    }
    window.addEventListener('scroll', this.checkSec);
  },
  computed: {
    isTimeReached() {
      return this.sec4Data.currentTime >= this.sec4Data.targetTime;
    },
    isDiff() {
      var iDays = parseInt(
        Math.abs(this.sec4Data.currentTime - this.sec4Data.targetTime) /
          1000 /
          60 /
          60 /
          24,
      );
      return iDays;
    },
  },
}).mount('#wrap');

const swiper = new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  centeredSlides: true,
  loop: true,
  speed: 1000,
  autoplay: true,
  disableOnInteraction: false,
  delay: 1000,
  // effect:'fade',
  breakpoints: {
    1920: {
      slidesPerView: 1,
      slidesPerGroup: 1,
    },
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

let swiper2 = new Swiper('.swiper2', {
  slidesPerView: 5,
  spaceBetween: 30,
  breakpoints: {
    1440: {
      slidesPerView: 5,
      // spaceBetween: 50,
    },
    1024: {
      slidesPerView: 4,
    },
    900: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 3,
      // spaceBetween: 50,
    },
    600: {
      slidesPerView: 3,
    },
    320: {
      slidesPerView: 1,
    },
  },
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

AOS.init();
