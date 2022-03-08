function open_card() {
    document.getElementById('outside').className = 'open-card';
  }
  
  function close_card() {
    document.getElementById('outside').className = '';
  }
  
  $('.carousel').carousel({
    interval: 50
  });
  
  function err1() {
      document.getElementById('outside-pic').src = 'https://drive.google.com/uc?export=view&id=1HFSXOXxpVfNFBqdaiWoh-zqDhwgaOh5x';
  }
  
  function err2() {
      document.getElementById('img1').src = 'https://pbs.twimg.com/media/C6YU7vzWYAEsncA.jpg';
  }
  
  function err3() {
      document.getElementById('img2').src = 'https://uri.org/sites/default/files/styles/hero_banner/public/media/images/2017/womens-day_650x400_61488877504.jpeg';
  }
  
  function err4() {
      document.getElementById('img3').src = 'https://pbs.twimg.com/media/CdAJ8nZVIAAxI6z.jpg';
  }
  
  function err5() {
      document.getElementById('img4').src = 'https://pbs.twimg.com/media/C6YSlTiVUAE1-eY.jpg';
  }
  
  function err6() {
      document.getElementById('img5').src = 'https://www.dobrateta.si/images/Prispevki/2014/Dan%20%C5%BEena/image1.jpg';
  }
  
  function err7() {
      document.getElementById('img6').src = 'https://i.pinimg.com/736x/1f/a3/44/1fa34408af52d74be2c3b4c263765890.jpg';
  }
  function createHeartPath(detalization = 25) {
    const path = []
    const rads = 2 * Math.PI
    const step = rads / detalization
    const size = Math.random() + .1
  
    for(let i = 0 ; i < detalization ; i++) {
      const angle = i * step
  
      path.push({
        x: size * 16 * Math.sin(angle) ** 3,
        y: size * -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle))
      })
    }
  
    return path
  }
  
  function createEightPath({cx, cy}, detalization = 80) {
    const path = []
    const rads = 2 * Math.PI
    const step = rads / detalization
  
    for (let i = 0 ; i < detalization ; i++) {
      const angle = i * step
      const size = 2 / (3 - Math.cos(angle * 2)) * cy * .8;
  
      path.push({
        x: cx + size * Math.sin(angle * 2) / 2,
        y: cy + size * Math.cos(angle)
      })
    }
  
    return path
  }
  
  class Heart {
    constructor(x, y, path) {
      this.homeX = this.x = x
      this.homeY = this.y = y
      this.path = path
  
      this.color = `hsla(${Math.random() * 60 - 60}, 100%, 50%, ${.8 - Math.random() * .5})`
  
      this.maxDistToMouse = 150
      this.heartSpeed = 500
  
      this.velocityX = 0
      this.velocityY = 0
  
      this.rotationSpeed = (Math.random() > .5 ? -1 : 1); 
      this.angle = Math.random() * Math.PI * 2
      this.offsetX = Math.cos(this.angle)
      this.offsetY = Math.sin(this.angle)
  
      this.explosionX = x
      this.explosionY = y
      this.isExplosion = false
      this.explosionRadius = 0
      this.explosionMaxRadius= 30
    }
    update({x, y}, {w, h}, correction) {
      const distToMouse = this.getApproximateDistance(this.x - x, this.y - y)
      // console.log(distToMouse);
  
      if (distToMouse < this.maxDistToMouse && this.velocityX === 0 && this.velocityY === 0) {
        this.velocityX = this.heartSpeed * (this.x - x) / distToMouse * correction
        this.velocityY = this.heartSpeed * (this.y - y) / distToMouse * correction
      } 
  
      this.x += this.velocityX
      this.y += this.velocityY
  
      this.angle += (this.rotationSpeed + this.velocityX + this.velocityY) * correction
      this.offsetX = Math.cos(this.angle) * 20
      this.offsetY = Math.sin(this.angle) * 20
  
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
        this.isExplosion = true
        this.explosionX = this.x
        this.explosionY = this.y
        this.x = this.homeX
        this.y = this.homeY
        this.velocityX = 0 
        this.velocityY = 0 
      }
    }
    updateExplosion() {
      if (this.isExplosion && this.explosionRadius < this.explosionMaxRadius) {
        this.explosionRadius++
      } else {
        this.isExplosion = false
        this.explosionRadius = 0
      }
    }
    drawExplosion(ctx) {
      if (this.isExplosion && this.explosionRadius < this.explosionMaxRadius) {
        const alpha = this.explosionRadius / this.explosionMaxRadius
        ctx.lineWidth = 10 - 10 * alpha
        ctx.strokeStyle = `hsla(${160 * alpha - 60}, 100%, 50%, ${1 - alpha * .5})`
  
        ctx.beginPath()
        ctx.arc(this.explosionX, this.explosionY, this.explosionRadius, 0 , Math.PI * 2)
        ctx.stroke()
      }
    }
    getApproximateDistance(dx, dy) {
      dx = Math.abs(dx);
      dy = Math.abs(dy);
      return dx < dy ? (123 * dy + 51 * dx) / 128 : (123 * dx + 51 * dy) / 128;
    }
  }
  
  class Canvas {
    constructor(container = document.body) {
      this.cnv = document.createElement(`canvas`)
      this.ctx = this.cnv.getContext(`2d`)
      container.appendChild(this.cnv)
      
      this.fitCanvasToContainer()
    }
    fitCanvasToContainer() {
      this.cnv.width = this.cnv.offsetWidth
      this.cnv.height = this.cnv.offsetHeight
    }
    clear() { 
      this.ctx.clearRect(0, 0, this.w, this.h) 
    }
    drawPath(path, color = `red`, fill = true, offsetX = 0, offsetY = 0) {
      const {ctx} = this
  
      ctx.fillStyle = ctx.strokeStyle = color
      ctx.lineWidth = 60
      ctx.lineJoin = `round`
  
      ctx.beginPath()
      path.forEach(({x, y}, i) => { 
        x += offsetX
        y += offsetY
  
        i < 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) 
      })
      ctx.closePath()
  
      fill ? ctx.fill() : ctx.stroke() 
    }
    drawText() {
      this.ctx.textAlign = `left`
      this.ctx.textBaseline = `middle`
      this.ctx.fillStyle = `rgb(0, 140, 80)`
      
      const textSize = this.h * .08
      this.ctx.font = `italic 900 ${textSize}px times new roman`
      // this.ctx.fillText(`Happy women's day!`,    this.cx, this.cy)
      this.ctx.fillText(`Chúc em luôn vui vẻ`,    this.cx + 120, this.cy - textSize)
      this.ctx.fillText(`và hạnh phúc <3`,  this.cx + 165, this.cy)
      this.ctx.fillText(`Love you so much!!!`,     this.cx + 130, this.cy + textSize)
      this.ctx.textAlign = `right`
      this.ctx.fillText(`March`,    this.cx - 200, this.cy)
    }
    get w() { return this.cnv.width } 
    get h() { return this.cnv.height } 
    get cx() { return this.cnv.width / 2 } 
    get cy() { return this.cnv.height / 2 } 
    get box() { return this.cnv.getBoundingClientRect() }
  }
  
  class Animation {
    constructor() {
      this.cnv = new Canvas
  
      this.deltaTime = 0;
      this.lastUpdate = 0;
  
      this.heartsCount = 200
  
      this.setup()
      this.createMouse()
      addEventListener(`resize`, () => this.setup())
      addEventListener(`mousemove`, e => this.updateMouse(e))
      requestAnimationFrame((stampTime) => this.animate(stampTime))
    }
    setup() {
      this.cnv.fitCanvasToContainer()
  
      this.eightPath = createEightPath(this.cnv)
      this.createHearts(this.cnv)
    }
    createHearts() {
      this.hearts = []
      for (let i = 0 ; i < this.heartsCount ; i++) {
        const pos = this.eightPath[ Math.floor(Math.random() * this.eightPath.length) ]
  
        this.hearts.push(new Heart(pos.x, pos.y, createHeartPath()))
      }
    }
    createMouse() {
      this.mouse = {
        x: undefined,
        y: undefined,
        moves: false,
      }
    }
    updateMouse(e) {
      if (e) {
        this.mouse.x = e.x - this.cnv.box.x
        this.mouse.y = e.y - this.cnv.box.y
        this.mouse.moves = true
      } else {
        this.mouse.moves = false
      }
    }
    update() {
      const correction = this.deltaTime * .001
      
      this.updateMouse() 
  
      this.hearts.forEach(heart => {
        heart.update(this.mouse, this.cnv, correction)
        heart.updateExplosion()
      })
    }
    render() {
      this.cnv.clear()
  
      this.cnv.drawPath(this.eightPath, `rgba(230, 160, 160, .7)`, false)
      
      this.hearts.forEach(heart => {
        this.cnv.drawPath(heart.path, heart.color, true, heart.x + heart.offsetX, heart.y + heart.offsetY)
        heart.drawExplosion(this.cnv.ctx)
      })
      
      this.cnv.drawText()
    }
    animate(stampTime) {
      requestAnimationFrame(stampTime => this.animate(stampTime))
  
      this.deltaTime = stampTime - this.lastUpdate;
      
      this.update()
      this.render()
      
      this.lastUpdate = stampTime;
    }
  }
  
  onload = () => new Animation
  