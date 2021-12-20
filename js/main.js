// Functions
const toMilliseconds = unit => {
  const seconds = 1000
  const minutes = seconds * 60
  const hours = minutes * 60
  const days = hours * 24

  if (unit === 'seconds') return seconds
  if (unit === 'minutes') return minutes
  if (unit === 'hours') return hours
  if (unit === 'days') return days
}

const isLeapYear = year => {
  const feb29 = new Date(year, 1, 29)
  return feb29.getDate() === 29
}

const getDaysInYear = year => {
  return isLeapYear(year) ? 366 : 365
}

const getYearDiff = (endDate, startDate) => {
  let yearDiff = endDate.getFullYear() - startDate.getFullYear()

  // Check if there's full years of difference
  const d = new Date(endDate)
  d.setFullYear(endDate.getFullYear() - yearDiff)
  if (d < startDate) yearDiff = yearDiff - 1

  const dayDiff = Array.from({ length: yearDiff })
    .map((value, index) => {
      const d = new Date(startDate)
      d.setFullYear(d.getFullYear() + index)

      const year = d.getFullYear()
      const month = d.getMonth()

      const isAfterMarch = month > 1

      return isAfterMarch ? getDaysInYear(year + 1) : getDaysInYear(year)
    })
    .reduce((sum, v) => sum + v, 0)

  return {
    years: yearDiff,
    days: dayDiff,
    ms: dayDiff * toMilliseconds('days')
  }
}

const getDaysInMonth = date => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const lastDayOfMonth = new Date(year, month + 1, 0)
  return lastDayOfMonth.getDate()
}

const getMonthDiff = (endDate, startDate) => {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear()
  let monthDiff = endDate.getMonth() + yearDiff * 12 - startDate.getMonth()

  // Check if there's a full month of difference
  const d = new Date(endDate)
  d.setMonth(endDate.getMonth() - monthDiff)
  if (d < startDate) monthDiff = monthDiff - 1

  const dayDiff = Array.from({ length: monthDiff })
    .map((v, index) => {
      const d = new Date(startDate)
      d.setMonth(startDate.getMonth() + index)
      return getDaysInMonth(d)
    })
    .reduce((sum, v) => sum + v, 0)

  return {
    months: monthDiff,
    days: dayDiff,
    ms: dayDiff * toMilliseconds('days')
  }
}

const getCountdown = (endDate, startDate) => {
  const yearDiff = getYearDiff(endDate, startDate)

  const d = new Date(startDate)
  d.setFullYear(d.getFullYear() + yearDiff.years)

  const monthDiff = getMonthDiff(endDate, d)
  const difference = endDate - startDate - yearDiff.ms - monthDiff.ms

  const days = Math.floor(difference / toMilliseconds('days'))
  const hours = Math.floor(
    (difference % toMilliseconds('days')) / toMilliseconds('hours')
  )
  const minutes = Math.floor(
    (difference % toMilliseconds('hours')) / toMilliseconds('minutes')
  )
  const seconds = Math.floor(
    (difference % toMilliseconds('minutes')) / toMilliseconds('seconds')
  )

  return {
    years: yearDiff.years,
    months: monthDiff.months,
    days,
    minutes,
    hours,
    seconds
  }
}

const setCountdownTarget = date => {
  const target = document.querySelector('.countdown__target')
  target.textContent = `
    ${date.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}
  `

  target.dataset.datetime =
    date.toLocaleString('en-GB', { year: 'numeric' }) +
    '-' +
    date.toLocaleString('en-GB', { month: '2-digit' }) +
    '-' +
    date.toLocaleString('en-GB', { day: '2-digit' })
}

const updateBoxes = (endDate, startDate) => {
  const now = new Date()
  const values = getCountdown(endDate, now)
  const boxes = document.querySelectorAll('.timer__box')

  boxes.forEach(box => {
    const unit = box.dataset.unit
    const value = values[unit]
    box.firstElementChild.textContent = value
  })
}

// Execution
const now = new Date()
const nextYear = new Date(2025, 0, 1)

// Update countdown
updateBoxes(nextYear)
setInterval(updateBoxes, 1000, nextYear)

// Update Countdown target
setCountdownTarget(nextYear)
