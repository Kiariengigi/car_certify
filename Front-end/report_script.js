//NAVBAR SCROLL CONTROL

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


//NAVBAR TITLE SELECTION
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


//MILEAGE CHART GENERATION
const colorPrimary = getComputedStyle(document.documentElement)
    .getPropertyValue("--chart-primary")
    .trim();

const colorLabel = getComputedStyle(document.documentElement)
    .getPropertyValue("--chart-label")
    .trim();

const fontFamily = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-family")
    .trim();

const defaultOptions = {

    chart: {
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
        width: '100%',
        height: 180,
        offsetY: 18
    },

    dataLabels: {
        enabled: false
    }

}



let barOptions = {

    ...defaultOptions,

    chart: {
        ...defaultOptions.chart,
        type: "area"
    },

    tooltip: {
        style: {
            fontFamily: fontFamily,
            color: '#ffffff'
        },
        y: {
            formatter: value => `${value}K`
        }
    },

    series: [
        {
            name: "Views",
            data: [15, 50, 18, 90, 30, 65]
        }
    ],

    colors: [colorPrimary],

    fill: {
        type: "gradient",
        gradient: {
            type: "vertical",
            opacityFrom: 1,
            opacityTo: 0,
            stops: [0, 100],
            colorStops: [
                {
                    offset: 0,
                    opacity: .2,
                    color: "#CD2C58"
                },
                {
                    offset: 100,
                    opacity: 0,
                    color: "#CD2C58"
                }
            ]
        }
    },

    stroke: { colors: [colorPrimary], lineCap: "round" },

    grid: {
        borderColor: "rgba(0, 0, 0, 0)",
        padding: {
            top: -30,
            right: 0,
            bottom: -8,
            left: 12
        }
    },

    markers: {
        strokeColors: colorPrimary
    },

    yaxis: {
        show: false
    },

    xaxis: {

        labels: {
            show: true,
            floating: true,
            style: {
                colors: colorLabel,
                fontFamily: fontFamily
            }
        },

        axisBorder: {
            show: false
        },

        crosshairs: {
            show: false
        },

        categories: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]

    }

};

let chart = new ApexCharts(
    document.querySelector(".area-chart"), barOptions
);

chart.render();