
import d3 from 'd3';
import PropTypes from 'prop-types';

import './alarm.css';

const propTypes = {
    data: PropTypes.shape({
    application_name: PropTypes.arrayOf(PropTypes.string),
    }),
  };

function AlarmViz(element, props) {
    const { data } = props;

    const { application_name } = data;

    element.innerHTML = '';

    //const application_name = data.form_data.application_name;
    //var records = [application_name, 12300, 0.1, 1131550, 0.25];
    var records = ['facebook', 12300, 0.1, 1131550, 0.25];

    //var records = ['twitter', 12300, 0.1, 1131550, 0.25];
    var cols = ['img', 'Alarmas', 'Usuarios'];
    var colors = {
        'video': '#d40f1c',
        'web': '#808080',
        'facebook': '#3b5998',
        'whatsapp': '#37cd57',
        'instagram': '#ec008b',
        'twitter': '#04a9f4'
    };
    var images = {
        'video': './images/video_logo.png',
        'web': './images/web_logo.png',
        'facebook': './images/facebook_logo.png',
        'whatsapp': './images/whatsapp_logo.png',
        'instagram': './images/instagram_logo.png',
        'twitter': './images/twitter_logo.png'
    };

    console.log(images['facebook']);

    const hMargin = 5;
    const vMargin = 17;
    const height = 110;
    const width = 3 * height + hMargin;
    const widthText = 0.9 * height;
    const widthText2 = 0.95 * height;
    const sizeFont1 = 21;
    const sizeFont2 = 0.8 * sizeFont1;

    // custom localization options
    var myLocale = {
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["$", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%m/%d/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    }

    // create custom locale formatter from the given locale options
    var localeFormatter = d3.locale(myLocale);
    // create a formatter for the number (grouped thousands with two significant digits). By default ',' means 'thousands' but we switched that into a '.' in our custom localization
    var numberFormat = localeFormatter.numberFormat(",");

    

    var pctFormat = d3.format("%");

    const div = d3.select(element);
    //const div = d3.select("#row1");

    

    //div.html('');
    const container = div.append("div")
        .attr("id", "container")
        .classed("svg-container", true);

    const svg = container
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height)
        .classed("svg-content", true);


    let g = svg.append('g');

    g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', colors[records[0]])
        .attr('stroke', 'white')
        .attr('stroke-width', 2);


    g.append('image')
        .attr('x', 2)
        .attr('y', 2)
        .attr('width', height - 5)
        .attr('height', height - 5)
        .attr('xlink:xlink:href', images[records[0]]);

    g.append('text')
        .attr('text-anchor', 'end')
        .attr('x', 2 * widthText)
        .attr('y', vMargin + sizeFont1)
        .text(numberFormat(records[1]))
        .attr('fill', 'white')
        .attr('font-size', sizeFont1)
        .style('font-weight', 'bold')
        .style('font-family', 'Arial');
    g.append('text')
        .attr('text-anchor', 'end')
        .attr('x', 2 * widthText)
        .attr('y', vMargin + sizeFont1 + sizeFont2)
        .text(pctFormat(records[2]))
        .attr('fill', 'white')
        .attr('font-size', sizeFont2)
        .style('font-weight', 'bold')
        .style('font-family', 'Arial');
    g.append('text')
        .attr('text-anchor', 'end')
        .attr('x', 2 * widthText)
        .attr('y', vMargin + sizeFont1 + 3 * sizeFont2)
        .text(cols[1])
        .attr('fill', 'white')
        .attr('font-size', 17)
        .style('font-weight', 'bold')
        .style('font-family', 'Arial');

    g.append('text')
        .attr('text-anchor', 'end')
        .attr('x', 3 * widthText2)
        .attr('y', vMargin + sizeFont1)
        .text(numberFormat(records[3]))
        .attr('fill', 'white')
        .attr('font-size', sizeFont1)
        .style('font-weight', 'bold')
        .style('font-family', 'Arial');
    g.append('text')
        .attr('text-anchor', 'end')
        .attr('x', 3 * widthText2)
        .attr('y', vMargin + sizeFont1 + sizeFont2)
        .text(pctFormat(records[4]))
        .attr('fill', 'white')
        .attr('font-size', sizeFont2)
        .style('font-weight', 'bold')
        .style('font-family', 'Arial');
    g.append('text')
        .attr('text-anchor', 'end')
        .attr('x', 3 * widthText2)
        .attr('y', vMargin + sizeFont1 + 3 * sizeFont2)
        .text(cols[2])
        .attr('fill', 'white')
        .attr('font-size', 17)
        .style('font-weight', 'bold')
        .style('font-family', 'Arial');

}


AlarmViz.displayName = 'AlarmViz';
AlarmViz.propTypes = propTypes;

export default AlarmViz;

/*
module.exports = customAlarmViz;
*/
