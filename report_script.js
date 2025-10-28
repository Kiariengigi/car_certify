const body = document.body
let lastScroll = 0

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset
    if(currentScroll <= 0){
        body.classList.remove("scroll-up")
        return
    }

    if (currentScroll > lastScroll && !body.classList.contains("scroll-down"))
    {
        body.classList.remove("scroll-up")
        body.classList.add("scroll-down")
    } else if(currentScroll < lastScroll && body.classList.contains("scroll-down")){
        body.classList.remove("scroll-down")
        body.classList.add("scroll-up")
    }
    lastScroll = currentScroll
})

document.addEventListener("DOMContentLoaded", function(){
    const navBar = document.getElementById('navBar')

    navBar.addEventListener('click', function(event){
        if (event.target.classList.contains('nav-link')){
            const alllinks = navBar.querySelectorAll('.nav-link')
            alllinks.forEach(link => {
                link.classList.remove('active')
            })

            event.target.classList.add('active')
        }
    })
})