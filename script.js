/**
 * ChatWing AI - Minimalist Website JavaScript
 * Handles mobile menu, FAQ accordion, and smooth scrolling
 */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  initMobileMenu()

  // FAQ Accordion
  initFAQAccordion()

  // Smooth Scrolling for Anchor Links
  initSmoothScrolling()

  // Add scroll effect to header
  initHeaderScrollEffect()
})

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
  const nav = document.getElementById("nav")

  if (!mobileMenuToggle || !nav) return

  mobileMenuToggle.addEventListener("click", () => {
    const isActive = nav.classList.contains("active")

    if (isActive) {
      nav.classList.remove("active")
      mobileMenuToggle.setAttribute("aria-expanded", "false")
    } else {
      nav.classList.add("active")
      mobileMenuToggle.setAttribute("aria-expanded", "true")
    }
  })

  // Close mobile menu when clicking on nav links
  const navLinks = nav.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active")
      mobileMenuToggle.setAttribute("aria-expanded", "false")
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
      nav.classList.remove("active")
      mobileMenuToggle.setAttribute("aria-expanded", "false")
    }
  })
}

/**
 * FAQ Accordion Functionality
 */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question")

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const faqItem = this.parentElement
      const answer = faqItem.querySelector(".faq-answer")
      const isExpanded = this.getAttribute("aria-expanded") === "true"

      // Close all other FAQ items
      faqQuestions.forEach((otherQuestion) => {
        if (otherQuestion !== this) {
          otherQuestion.setAttribute("aria-expanded", "false")
          const otherAnswer = otherQuestion.parentElement.querySelector(".faq-answer")
          otherAnswer.classList.remove("active")
        }
      })

      // Toggle current FAQ item
      if (isExpanded) {
        this.setAttribute("aria-expanded", "false")
        answer.classList.remove("active")
      } else {
        this.setAttribute("aria-expanded", "true")
        answer.classList.add("active")
      }
    })

    // Handle keyboard navigation
    question.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        this.click()
      }
    })
  })
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const href = this.getAttribute("href")

      // Skip if it's just "#"
      if (href === "#") return

      const targetElement = document.querySelector(href)

      if (targetElement) {
        event.preventDefault()

        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Update focus for accessibility
        targetElement.setAttribute("tabindex", "-1")
        targetElement.focus()
      }
    })
  })
}

/**
 * Header Scroll Effect
 */
function initHeaderScrollEffect() {
  const header = document.querySelector(".header")
  if (!header) return

  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 100) {
      header.style.backgroundColor = "rgba(253, 252, 251, 0.95)"
      header.style.backdropFilter = "blur(10px)"
    } else {
      header.style.backgroundColor = "#FDFCFB"
      header.style.backdropFilter = "none"
    }

    lastScrollTop = scrollTop
  })
}

/**
 * Utility function to handle form submissions (if needed in the future)
 */
function handleFormSubmission(formElement, callback) {
  if (!formElement) return

  formElement.addEventListener("submit", (event) => {
    event.preventDefault()

    // Add loading state
    const submitButton = formElement.querySelector('button[type="submit"]')
    const originalText = submitButton.textContent

    submitButton.textContent = "Enviando..."
    submitButton.disabled = true

    // Simulate form processing
    setTimeout(() => {
      submitButton.textContent = originalText
      submitButton.disabled = false

      if (callback) callback()
    }, 2000)
  })
}

/**
 * Intersection Observer for animations (optional enhancement)
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements that should animate on scroll
  const animatedElements = document.querySelectorAll(".step, .feature-item, .testimonial-content")
  animatedElements.forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"
    element.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(element)
  })
}

// Initialize scroll animations if supported
if ("IntersectionObserver" in window) {
  initScrollAnimations()
}
