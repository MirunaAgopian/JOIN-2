function setPrioColor(element) {
  const containers = document.querySelectorAll('.txt-img');
  containers.forEach(c => {
    c.classList.remove('active');
    const icon = c.querySelector('.prio-img');
    if (icon) icon.classList.remove('active');
  });
  element.classList.add('active');
  const clickedIcon = element.querySelector('.prio-img');
  if (clickedIcon) clickedIcon.classList.add('active');
}

