class KawaiiPomodoroTimer {
  constructor() {
    this.modes = {
      pomodoro: { duration: 25 * 60, label: "Trabajo", color: "work" },
      shortBreak: { duration: 5 * 60, label: "Descanso Corto", color: "break" },
      longBreak: { duration: 15 * 60, label: "Descanso Largo", color: "break" },
    }

    this.currentMode = "pomodoro"
    this.timeLeft = this.modes[this.currentMode].duration
    this.totalTime = this.modes[this.currentMode].duration
    this.isRunning = false
    this.timer = null
    this.sessions = 0
    this.level = 1

    this.initializeElements()
    this.attachEventListeners()
    this.updateDisplay()
    this.createFloatingElements()
    this.updateCustomTimes()
  }

  initializeElements() {
    this.timeDisplay = document.getElementById("timeDisplay")
    this.potionLiquid = document.getElementById("potionLiquid")
    this.startBtn = document.getElementById("startBtn")
    this.pauseBtn = document.getElementById("pauseBtn")
    this.resetBtn = document.getElementById("resetBtn")
    this.progressFill = document.getElementById("progressFill")
    this.sessionsDisplay = document.getElementById("sessions")
    this.levelDisplay = document.getElementById("level")
    this.achievementDisplay = document.getElementById("achievement")
    this.modeButtons = document.querySelectorAll(".mode-btn")
    this.bottleMouth = document.getElementById("bottleMouth")

    // Time customization elements
    this.workTimeSlider = document.getElementById("workTime")
    this.shortBreakTimeSlider = document.getElementById("shortBreakTime")
    this.longBreakTimeSlider = document.getElementById("longBreakTime")
    this.workValue = document.getElementById("workValue")
    this.shortBreakValue = document.getElementById("shortBreakValue")
    this.longBreakValue = document.getElementById("longBreakValue")

    // Mode time displays
    this.workModeTime = document.getElementById("workModeTime")
    this.shortBreakModeTime = document.getElementById("shortBreakModeTime")
    this.longBreakModeTime = document.getElementById("longBreakModeTime")
  }

  attachEventListeners() {
    this.startBtn.addEventListener("click", () => this.start())
    this.pauseBtn.addEventListener("click", () => this.pause())
    this.resetBtn.addEventListener("click", () => this.reset())

    this.modeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const mode = e.currentTarget.dataset.mode
        this.switchMode(mode)
      })
    })

    // Time customization listeners
    this.workTimeSlider.addEventListener("input", (e) => {
      this.workValue.textContent = e.target.value
      this.modes.pomodoro.duration = Number.parseInt(e.target.value) * 60
      this.workModeTime.textContent = `${e.target.value}m`
      if (this.currentMode === "pomodoro" && !this.isRunning) {
        this.reset()
      }
    })

    this.shortBreakTimeSlider.addEventListener("input", (e) => {
      this.shortBreakValue.textContent = e.target.value
      this.modes.shortBreak.duration = Number.parseInt(e.target.value) * 60
      this.shortBreakModeTime.textContent = `${e.target.value}m`
      if (this.currentMode === "shortBreak" && !this.isRunning) {
        this.reset()
      }
    })

    this.longBreakTimeSlider.addEventListener("input", (e) => {
      this.longBreakValue.textContent = e.target.value
      this.modes.longBreak.duration = Number.parseInt(e.target.value) * 60
      this.longBreakModeTime.textContent = `${e.target.value}m`
      if (this.currentMode === "longBreak" && !this.isRunning) {
        this.reset()
      }
    })
  }

  updateCustomTimes() {
    this.workValue.textContent = this.workTimeSlider.value
    this.shortBreakValue.textContent = this.shortBreakTimeSlider.value
    this.longBreakValue.textContent = this.longBreakTimeSlider.value

    this.workModeTime.textContent = `${this.workTimeSlider.value}m`
    this.shortBreakModeTime.textContent = `${this.shortBreakTimeSlider.value}m`
    this.longBreakModeTime.textContent = `${this.longBreakTimeSlider.value}m`
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true
      this.startBtn.disabled = true
      this.pauseBtn.disabled = false
      this.bottleMouth.textContent = "◡"
      this.bottleMouth.classList.add("happy")

      this.timer = setInterval(() => {
        this.timeLeft--
        this.updateDisplay()

        if (this.timeLeft <= 0) {
          this.complete()
        }
      }, 1000)
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false
      this.startBtn.disabled = false
      this.pauseBtn.disabled = true
      this.bottleMouth.textContent = "ᵕ"
      this.bottleMouth.classList.remove("happy")
      clearInterval(this.timer)
    }
  }

  reset() {
    this.pause()
    this.timeLeft = this.modes[this.currentMode].duration
    this.totalTime = this.modes[this.currentMode].duration
    this.updateDisplay()
    this.startBtn.disabled = false
    this.pauseBtn.disabled = true
    this.bottleMouth.textContent = "ᵕ"
    this.bottleMouth.classList.remove("happy", "sleepy")
  }

  complete() {
    this.pause()
    this.sessions++
    this.updateLevel()
    this.showAchievement()
    this.celebrateCompletion()
    this.bottleMouth.textContent = "◕"
    this.bottleMouth.classList.add("sleepy")

    // Auto switch to break mode after work session
    if (this.currentMode === "pomodoro") {
      const nextMode = this.sessions % 4 === 0 ? "longBreak" : "shortBreak"
      setTimeout(() => this.switchMode(nextMode), 3000)
    } else {
      setTimeout(() => this.switchMode("pomodoro"), 3000)
    }
  }

  switchMode(mode) {
    this.currentMode = mode
    this.reset()

    // Update active button
    this.modeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode)
    })

    // Update potion color
    this.potionLiquid.className = `potion-liquid ${this.modes[mode].color}`
  }

  updateDisplay() {
    // Update time display
    const minutes = Math.floor(this.timeLeft / 60)
    const seconds = this.timeLeft % 60
    this.timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

    // Update potion level
    const percentage = (this.timeLeft / this.totalTime) * 100
    this.potionLiquid.style.height = `${percentage}%`

    // Update progress bar
    const progressPercentage = ((this.totalTime - this.timeLeft) / this.totalTime) * 100
    this.progressFill.style.width = `${progressPercentage}%`

    // Update stats
    this.sessionsDisplay.textContent = this.sessions
    this.levelDisplay.textContent = this.level

    // Gentle pulse effect when time is running out
    if (this.timeLeft <= 60 && this.timeLeft > 0 && this.isRunning) {
      this.potionLiquid.classList.add("potion-empty")
      setTimeout(() => this.potionLiquid.classList.remove("potion-empty"), 800)
    }
  }

  updateLevel() {
    const newLevel = Math.floor(this.sessions / 4) + 1
    if (newLevel > this.level) {
      this.level = newLevel
      this.showAchievement(`✨ ¡Nivel ${this.level} alcanzado! ✨`)
    }
  }

  showAchievement(message = "") {
    if (!message) {
      const achievements = [
        "¡Sesión completada! 🌸",
        "¡Excelente trabajo! ⭐",
        "¡Sigue así! 💖",
        "¡Eres increíble! 🦄",
        "¡Productividad kawaii! ✨",
        "¡Muy bien hecho! 🌟",
        "¡Eres una estrella! 💫",
        "¡Fantástico progreso! 🎀",
      ]
      message = achievements[Math.floor(Math.random() * achievements.length)]
    }

    this.achievementDisplay.textContent = message
    this.achievementDisplay.classList.add("celebration")

    setTimeout(() => {
      this.achievementDisplay.classList.remove("celebration")
      setTimeout(() => {
        this.achievementDisplay.textContent = ""
      }, 4000)
    }, 800)
  }

  celebrateCompletion() {
    // Add celebration floating elements
    for (let i = 0; i < 15; i++) {
      setTimeout(() => this.createCelebrationElement(), i * 150)
    }

    // Gentle shake effect
    document.querySelector(".game-container").classList.add("celebration")
    setTimeout(() => {
      document.querySelector(".game-container").classList.remove("celebration")
    }, 800)
  }

  createFloatingElements() {
    const floatingContainer = document.getElementById("floatingElements")
    const elements = ["🌸", "✨", "💖", "🌟", "💫", "🦄", "🎀", "💕"]

    setInterval(() => {
      if (Math.random() < 0.4) {
        const element = document.createElement("div")
        element.className = "floating-element"
        element.textContent = elements[Math.floor(Math.random() * elements.length)]
        element.style.left = Math.random() * 100 + "%"
        element.style.animationDelay = Math.random() * 2 + "s"
        element.style.animationDuration = Math.random() * 4 + 6 + "s"

        floatingContainer.appendChild(element)

        setTimeout(() => {
          element.remove()
        }, 10000)
      }
    }, 3000)
  }

  createCelebrationElement() {
    const elements = ["🌸", "✨", "💖", "🌟", "💫", "🎀", "💕", "🦄"]
    const element = document.createElement("div")
    element.style.position = "fixed"
    element.style.fontSize = "24px"
    element.style.pointerEvents = "none"
    element.style.zIndex = "1000"
    element.style.left = "50%"
    element.style.top = "50%"
    element.textContent = elements[Math.floor(Math.random() * elements.length)]

    const angle = Math.random() * Math.PI * 2
    const velocity = Math.random() * 150 + 100
    const vx = Math.cos(angle) * velocity
    let vy = -(Math.random() * 150 + 100)

    document.body.appendChild(element)

    let x = 0,
      y = 0
    const animate = () => {
      x += vx * 0.02
      y += vy * 0.02
      vy += 3 // gentle gravity

      element.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.5}deg)`
      element.style.opacity = Math.max(0, 1 - Math.abs(y) / 200)

      if (element.style.opacity > 0) {
        requestAnimationFrame(animate)
      } else {
        element.remove()
      }
    }

    animate()
  }
}

// Initialize the timer when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new KawaiiPomodoroTimer()
})

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault()
    const startBtn = document.getElementById("startBtn")
    const pauseBtn = document.getElementById("pauseBtn")

    if (!startBtn.disabled) {
      startBtn.click()
    } else if (!pauseBtn.disabled) {
      pauseBtn.click()
    }
  } else if (e.code === "KeyR") {
    document.getElementById("resetBtn").click()
  }
})
