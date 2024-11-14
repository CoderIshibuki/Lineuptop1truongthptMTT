var data = {form: "0", cards: []};
var posSel = "-1";
var multiSel = false;
var selDatas = [];
var posData = [];
var faceIdx = [];
var selected = "0";
var filterTeam = "";
var teamInfos = [{}];
var visitCount = 0;
var saveCount = 0;

const notices = "Ủng Hộ Tôi Tại <br><b>6999927092007 (MBBank)<br>";


const onlongclick = ($target, duration, callback) => {
    $target.onmousedown = () => {
      const timer = setTimeout(callback, duration);
    
      $target.onmouseup = () => {
        clearTimeout(timer);
      };
    };  
  }

$(function() {
    formation.forEach(function(e) {
        var opt = document.createElement("option");
        opt.setAttribute("value", e.id);
        opt.innerText = e.name;
        document.querySelector("#form-select").appendChild(opt);
    });

    document.querySelectorAll('.position').forEach(function(e) {
        e.onclick = function(t) {
            if(posSel != this.id) {
                posSel = this.id;
                if(multiSel) {
                    selDatas.push(posSel);
                    posData.push($('#' + posSel + ' > div.pos-text').text());
                    $('.pos-name').text("Lựa Chọn: " + posData.join(','));
                } else {
                    posData = [];
                    $('.pos-name').text("Lựa Chọn: " + $('#' + posSel + ' > div.pos-text').text());
                    if($(this).attr('pdx') != "-1") {
                        getFaces(allData[Number($(this).attr('pdx'))].originName);
                    }
                }
                if($(this).css("background").indexOf("url") == -1) {
                    $(this).css({border: '1px solid green'});
                    if(!multiSel) {
                        var nd = $('.squad-content > div.position').not('#' + posSel);
                        for(var i = 0; i < nd.length; i++) {
                            if($(nd[i]).css("background").indexOf("url") != -1) {
                                $(nd[i]).css({border: 'none'});
                            } else {
                                $(nd[i]).css({border: '1px solid red'});
                            }
                        }
                    }
                }
            }
            if($(this).css("background").indexOf("url") != -1) {
                $('#inputTxt').val(cardData[Number($(this).attr('cdx'))].name);
                if($(this).attr('pdx') != "-1") {
                    $('#inputPlayer').val(allData[Number($(this).attr('pdx'))].name);
                }
            } else {
                $('#inputTxt').val('');
            }
            if(window.innerWidth <= 992) {
                showInfo(this);
            }
        }

        e.ondblclick = function(e) {
            showInfo(this);
        }

        e.onmousedown = function(e) {
            if(e.which == 3 || e.button == 2) {
                posSel = this.id;
                replacePosition();  
            }
        }

        if(location.origin.indexOf("127.0.0.1") != -1 || location.origin.indexOf("indvel.github.io") != -1) {
            showPopup("Hello!", notices);
        }
    });

    if(window.innerWidth <= 992) {
        var diff = 1000 - window.innerWidth;
        $('.div-img').css({width: '800px', height: '650px'});
        $('.bg-img').css({width: '800px', height: "650px"});
        $('.main-content').css({height: 'fit-content'});
        $('.side-menu').css({width: '200px'});
        $('#btnClear').css({width: 'auto'});
        $('#btnSave').css({width: 'auto'});
        $('#face-select').css({width: '150px'});
        $('.detail-search').css({width: '150px', marginLeft: '800px'});
        $('.div-bottom').css({display: 'none'});
        $('.div-bottom2').css({display: 'block'});
        selected = "0";
        changeFormation();
    } else {
        $('.div-img').css({width: '1000px', height: '650px'});
        $('.bg-img').css({width: '1000px', height: "650px"});
        $('.side-menu').css({width: 'fit-content'});
        $('.main-content').css({height: '100%'});
        $('#btnClear').css({width: '235px'});
        $('#btnSave').css({width: '235px'});
        $('#face-select').css({width: '200px'});
        $('.detail-search').css({width: '250px', marginLeft: '1000px'});
        $('.div-bottom').css({display: 'flex'});
        $('.div-bottom2').css({display: 'none'});
    }
});

function closeNotice() {
    $('.notice-popup').css({display: 'none'});
}

function showInfo(t) {
    if($(t).attr('pdx') != "-1" && $('.player-info').css('display') != 'block') {
        var sel = allData[Number($(t).attr('pdx'))];
        var ul = document.querySelector('.info-list');
        ul.innerHTML = "";
        var li1 = document.createElement("li");
        if(sel.originName.length >= 12 && sel.originName.length <= 13) {
            li1.innerHTML = "<span style='font-size: 15px;'><b>" + sel.originName + '</b></span>';
        } else if(sel.originName.length > 13 && sel.originName.length < 16) {
            li1.innerHTML = "<span style='font-size: 13px;'><b>" + sel.originName + '</b></span>';
        } else if(sel.originName.length == 16) {
            li1.innerHTML = "<span style='font-size: 12px;'><b>" + sel.originName + '</b></span>';
        } else if(sel.originName.length > 16 && sel.originName.length < 20) {
            li1.innerHTML = "<span style='font-size: 11px;'><b>" + sel.originName + '</b></span>';
        } else if(sel.originName.length >= 20) { 
            li1.innerHTML = "<span style='font-size: 10px;'><b>" + sel.originName + '</b></span>';
        } else {
            li1.innerHTML = '<b>' + sel.originName + '</b>';
        }
        ul.appendChild(li1);
        var li2 = document.createElement("li");
        var flag = countryData[countryData.findIndex(e => e.name == sel.country)].logos;
        if(sel.country.length >= 10) {
            li2.innerHTML = 'Quốc Tịch: <img style="width:25px;" src="' + flag + '"><span style="font-size:11px;"><b>' + sel.country + '</b></span>';
        } else {
            li2.innerHTML = 'Quốc Tịch: <img style="width:25px;" src="' + flag + '"><b>' + sel.country + '</b>';
        }
        ul.appendChild(li2);
        var li3 = document.createElement("li");
        li3.innerHTML = "Ngày Sinh: <b>" + sel.birth + "</b>";
        ul.appendChild(li3);
        var li4 = document.createElement("li");
        li4.innerHTML = "Vị Trí: <b>" + sel.pos + "</b>";
        ul.appendChild(li4);
        var li5 = document.createElement("li");
        li5.innerHTML = "Thể Hình: <b>" + sel.height + ' / ' + sel.weight + "</b>";
        ul.appendChild(li5);
        var li6 = document.createElement("li");
        if(sel.team.length >= 10) {
            li6.innerHTML = "Đội Ngũ Liên Kết: <span style='font-size: 11px;'><b>" + sel.team + '</b></span>';
        } else {
            li6.innerHTML = "Đội Ngũ Liên Kết: <b>" + sel.team + "</b>";
        }
        ul.appendChild(li6);
        var li7 = document.createElement("li");
        li7.setAttribute("class", "career-list");
        var filter = sel.career.filter((c, i) => {
            return sel.career.indexOf(c) === i;
        });
        li7.innerHTML = '<div class="div-career">' + "Lịch Sử Cá Nhân: <span style='font-size: 11px;'><b><br>&nbsp;" + filter.join("<br>&nbsp;") + "</b></span></div>";
        ul.appendChild(li7);
        var mleft = (Number($(t).css('left').replace("px", "")) - 180) + 'px';
        var mtop = (Number($(t).css('top').replace("px", "")) - 150) + 'px';
        $('#replace-button').css({display: 'flex'});
        $('.player-info').css({display: 'block', left: mleft, top: mtop});
    }
}

$(document).on('change', '#form-select', function() {
    selected = $('#form-select option:selected').val();
    data.form = selected;
    changeFormation();
});

$('#checkMulti').change(function(e) {
    if($(this).prop('checked')) {
        multiSel = true;
        selDatas = [];
    } else {
        multiSel = false;
        selDatas = [];
        posData = [];
        document.querySelectorAll('.position').forEach(function(e) {
            if($('#' + e.id).css("background").indexOf("url") == -1) {
                $('#' + e.id).css({background: '', border: '1px solid red'});
            }
        });
        $('.pos-name').text("Lựa Chọn: ");
    }
});

function changeFormation() {
    if(selected != "") {
        $('.squad-text').text(formation[Number(selected)].name);
        formation[Number(selected)].pos.forEach(function(e) {
            if(e.xy == "0") {
                $('#' + e.name).css({display: 'none'});
            } else {
                var split = e.xy.split(",");
                if(window.innerWidth <= 992) {
                    var diff = 1080 - window.innerWidth;
                    var mleft;
                    mleft = Number(split[0].replace("px", "")) - diff;
                    $('#' + e.name).css({display: 'flex', left: mleft + 'px', top: split[1], textAlign: 'center'});
                } else {
                    $('#' + e.name).css({display: 'flex', left: split[0], top: split[1], textAlign: 'center'});
                }
                $('#' + e.name + ' > div.pos-text').text(e.text);
            }
        });
    }
}

function filteringAll() {
    if(allData != null && allData.length != 0) {
        var f = allData.filter(function(item1, idx1) {
            return allData.findIndex(function(item2, idx) {
                 return item1.name == item2.name
            }) == idx1;
        });
        allData = f;
    }
}

function filteringData(d, key) {
    if(d != null && d.length != 0) {
        var f = d.filter(function(item1, idx1) {
            return d.findIndex(function(item2, idx) {
                return item1['key'] == item2['key']
            }) == idx1;
        });
        return f;
    }
}

function searchCards() {
    if($('#inputTxt').val().length == 0) {
        $('#card-list').css({display: 'none'});
    } else {
        $('#card-list').css({display: 'block'});
        var list = document.querySelector('#card-list > .search-list');
        list.innerHTML = "";
        var text = $('#inputTxt').val();
        var f = cardData.filter((v) => {
            if(v.name.indexOf(text.toUpperCase()) != -1 || v.otherNames.indexOf(text.toUpperCase()) != -1) {
                return true;
            }
            return false;
        });
        f.forEach(function(e) {
            var li = document.createElement("li");
            li.setAttribute("idx", e.idx);
            li.innerHTML = '<img style="width:25px;" src=' + e.image + '> <span style="color:black;">' + e.name + '</span>';
            li.onclick = function(e) {
                var t = this;
                if(multiSel) {
                    selDatas.forEach(function(e) {
                        $('#' + e).css({
                            background: 'url(' + cardData[Number(t.getAttribute("idx"))].image + ')',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            border: 'none'
                        });
                        $('#' + e).attr('cdx', t.getAttribute("idx"));
                        $('#' + e + ' > div.card-text').css({color: cardData[Number(t.getAttribute("idx"))].color});
                        if(cardData[Number(t.getAttribute("idx"))].type == "fc") {
                            $('#' + e + ' > div.card-text').css({marginTop: '40px'});
                        } else if(cardData[Number(t.getAttribute("idx"))].type == "fm"){
                            $('#' + e + ' > div.card-text').css({marginTop: ''});
                        }
                    });
                } else {
                    $('#' + posSel).css({
                        background: 'url(' + cardData[Number(this.getAttribute("idx"))].image + ')',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: 'none'
                    });
                    $('#' + posSel).attr('cdx', this.getAttribute("idx"));
                    $('#' + posSel + ' > div.card-text').css({color: cardData[Number(this.getAttribute("idx"))].color});
                    if(cardData[Number(t.getAttribute("idx"))].type == "fc") {
                        $('#' + posSel + ' > div.card-text').css({marginTop: '40px'});
                    } else if(cardData[Number(t.getAttribute("idx"))].type == "fm"){
                        $('#' + posSel + ' > div.card-text').css({marginTop: ''});
                    }
                    $('#face-select').prop('selectedIndex', 0).change();
                    if($('#' + posSel).attr('pdx') != "-1") {
                        getFaces(allData[Number($('#' + posSel).attr('pdx'))].originName);
                        var opt = document.querySelectorAll('#face-select > option');
                        $('#face-select').prop('selectedIndex', 0).change();
                        for(var i = 0; i < opt.length; i++) {
                            if(opt[i].innerText.indexOf(cardData[Number($('#' + posSel).attr('cdx'))].code) != -1) {
                                $('#face-select').prop('selectedIndex', i).change();
                                break;
                            }
                        }
                    }
                }
                $('#card-list').css({display: 'none'});
            }
            list.appendChild(li);
        });
    }
}


function showPopup(title, text) {
    $('.notice-popup').css({display: 'block'});
    $('.notice-title').text(title);
    $('.notice-content').html(text);
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



function replacePosition() {
    if($('.change-pos').css('display') != 'block') {
        $('.change-pos').css({display: 'block'});
        loadPosData();
    }
    $('.player-info').css({display: 'none'});
}

function cancelChange() {
    $('.change-pos').css({display: 'none'});
}

function loadPosData() {
    if(posSel != '-1') {
        document.querySelector('#change-select').innerHTML = '';
        document.querySelectorAll('.position').forEach(function(e) {
            if($('#' + e.id).attr('cdx') != '-1' && posSel != e.id) {
                var opt = document.createElement("option");
                opt.setAttribute('value', e.id);
                if($('#' + e.id).attr('pdx') != '-1') {
                    opt.innerHTML = $('#' + e.id + ' > .pos-text').text() + ': ' + allData[Number($('#' + e.id).attr('pdx'))].name;
                } else {
                    opt.innerHTML = $('#' + e.id + ' > .pos-text').text() + ': ' + cardData[Number($('#' + e.id).attr('cdx'))].name;
                }
                document.querySelector('#change-select').appendChild(opt);
            }
        });   
    }
}

function changePosition() {
    var sel = $('#change-select option:selected').val();
    var tempHtml = '';
    var tempCdx = '';
    var tempPdx = '';
    var tempBack = '';
    var tempFace = '';
    tempHtml = document.querySelector('#' + sel).innerHTML;
    tempCdx = $('#' + sel).attr('cdx');
    tempPdx = $('#' + sel).attr('pdx');
    tempBack = $('#' + sel).css('background');
    tempFace = $('#' + sel + ' > .face-img > img').attr('src');

    var tname = allData[Number(tempPdx)].name;
    var name = allData[Number($('#' + posSel).attr('pdx'))].name;
    var tempPos = $('#' + sel + ' > .pos-text').text();
    var tempPos2 = $('#' + posSel + ' > .pos-text').text();

    document.querySelector('#' + sel).innerHTML = document.querySelector('#' + posSel).innerHTML;
    $('#' + sel + ' > .pos-text').text(tempPos);
    $('#' + sel).attr('cdx', $('#' + posSel).attr('cdx'));
    $('#' + sel).attr('pdx', $('#' + posSel).attr('pdx'));
    $('#' + sel).css('background', $('#' + posSel).css('background'));
    $('#' + sel + ' > .face-img > img').attr('src', $('#' + posSel + ' > .face-img > img').attr('src'));

    if(name.length > 6 && name.length <= 8) {
        $('#' + sel + ' > div.card-text').css({fontSize: Number(name.length + 1) + 'px'});
    } else if(name.length > 8 && name.length < 10) {
        $('#' + sel + ' > div.card-text').css({fontSize: Number(name.length - 2) + 'px'});
    } else if(name.length == 10) {
        $('#' + sel + ' > div.card-text').css({fontSize: Number(name.length - 2.5) + 'px'});
    } else if(name.length >= 11) {
        $('#' + sel + ' > div.card-text').css({fontSize: Number(name.length - 5) + 'px'});
    } else {
        $('#' + sel + ' > div.card-text').css({fontSize: '10px'});
    }

    document.querySelector('#' + posSel).innerHTML = tempHtml;
    $('#' + posSel + ' > .pos-text').text(tempPos2);
    $('#' + posSel).attr('cdx', tempCdx);
    $('#' + posSel).attr('pdx', tempPdx);
    $('#' + posSel).css('background', tempBack);
    $('#' + posSel + ' > .face-img > img').attr('src', tempFace);

    if(tname.length > 6 && tname.length <= 8) {
        $('#' + posSel + ' > div.card-text').css({fontSize: Number(tname.length + 1) + 'px'});
    } else if(tname.length > 8 && tname.length < 10) {
        $('#' + posSel + ' > div.card-text').css({fontSize: Number(tname.length - 2) + 'px'});
    } else if(tname.length == 10) {
        $('#' + posSel + ' > div.card-text').css({fontSize: Number(tname.length - 2.5) + 'px'});
    } else if(tname.length >= 11) {
        $('#' + posSel + ' > div.card-text').css({fontSize: Number(tname.length - 5) + 'px'});
    } else {
        $('#' + posSel + ' > div.card-text').css({fontSize: '10px'});
    }

    $('.change-pos').css({display: 'none'});
}

function saveImage() {
    html2canvas($('.div-squad')[0], {allowTaint: true, useCORS: true, scale: 1, logging: true}).then(canvas => {
        var date = new Date();
        var now = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2)
         + "_" + ('0' + date.getHours()).slice(-2) + "-" + ('0' + date.getMinutes()).slice(-2) + "-" + ('0' + date.getSeconds()).slice(-2);
        saveImg(canvas.toDataURL('image/png'), 'SQUAD-' + now +'.png');
    });
}

const saveImg = (uri, filename) => {
    let link = document.createElement('a');

    document.body.appendChild(link);

    link.href = uri;
    link.download = filename;
    link.click();

    document.body.removeChild(link);

    if(saveCount >= 0) {
        saveCount++;
        sendSaveCount(saveCount);
    }
};

function saveData() {
    data.cards = [];
    document.querySelectorAll('.position').forEach(function(e) {
        if($('#' + e.id).attr('cdx') != '-1') {
            if(cardData[Number($('#' + e.id).attr('cdx'))].type == 'fc') {
                if(specialCard.indexOf(cardData[Number($('#' + e.id).attr('cdx'))].name) != -1 || $('#' + e.id + '> .face-img > img').attr("src").indexOf("indvel.github.io") != -1) {
                    data.cards.push({name: e.id, cardIdx: e.getAttribute("cdx"), playerIdx: e.getAttribute("pdx"), face: $('#' + e.id + '> .face-img > img').attr("src").split("players/")[1]});
                } else {
                    data.cards.push({name: e.id, cardIdx: e.getAttribute("cdx"), playerIdx: e.getAttribute("pdx"), face: $('#' + e.id + '> .face-img > img').attr("src").split("image-cdn/")[1]});
                }
            } else {
                data.cards.push({name: e.id, cardIdx: e.getAttribute("cdx"), playerIdx: e.getAttribute("pdx"), face: $('#' + e.id + '> .face-img > img').attr("src").split("players/")[1]});
            }
        }
    });

    const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
    const url = window.URL.createObjectURL(blob);
    var date = new Date();
    var now = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2)
         + "_" + ('0' + date.getHours()).slice(-2) + "-" + ('0' + date.getMinutes()).slice(-2) + "-" + ('0' + date.getSeconds()).slice(-2);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = "SQUAD-" + now;
    document.body.appendChild(a);
    
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

function applyData() {
    selected = data.form;
    clearData();
    changeFormation();
    document.querySelector('#form-select').value = selected;
    data.cards.forEach(function(e) {
        var cdx = e.cardIdx;
        if(cdx != '-1') {
            $('#' + e.name).css({
                background: 'url(' + cardData[Number(cdx)].image + ')',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                border: 'none'
            });
            $('#' + e.name).attr('cdx', e.cardIdx);
            $('#' + e.name + ' > div.card-text').css({color: cardData[Number(cdx)].color});
            if(cardData[Number(cdx)].type == "fc") {
                $('#' + e.name + ' > div.card-text').css({marginTop: '40px'});
            } else if(cardData[Number(cdx)].type == "fm"){
                $('#' + e.name + ' > div.card-text').css({marginTop: ''});
            }
        }

        var pdx = e.playerIdx;
        if(pdx != '-1') {
            var name = allData[Number(pdx)].name;
            if(name.length > 6 && name.length <= 8) {
                $('#' + e.name + ' > div.card-text').css({fontSize: Number(name.length + 1) + 'px'});
            } else if(name.length > 8 && name.length < 10) {
                $('#' + e.name + ' > div.card-text').css({fontSize: Number(name.length - 1) + 'px'});
            } else if(name.length == 10) {
                $('#' + e.name + ' > div.card-text').css({fontSize: Number(name.length - 2.5) + 'px'});
            } else if(name.length >= 11) {
                $('#' + e.name + ' > div.card-text').css({fontSize: Number(name.length - 5) + 'px'});
            } else {
                $('#' + e.name + ' > div.card-text').css({fontSize: '10px'});
            }
            $('#' + e.name + ' > div.card-text').text(allData[Number(pdx)].name);
            $('#' + e.name).attr("pdx", e.playerIdx);
        }
        if(e.hasOwnProperty('face')) {
            if(e.face.indexOf('/normal') != -1) {
                $('#' + e.name + ' > .face-img > img').attr('src', 'https://renderz.app/image-cdn/' + e.face);
            } else {
                $('#' + e.name + ' > .face-img > img').attr('src', './resources/players/' + e.face);
            }
        } else {
            $('#' + e.name + ' > .face-img > img').attr('src', 'resources/img_transparent.png');
        }
    });
    setTeamColors();    
}

function removeData() {
    if(posSel != "-1") {
        if(multiSel) {
            selDatas.forEach(function(e) {
                $('#' + e).css({background: '', border: '1px solid red'});
                $('#' + e + ' > div.card-text').text('');
                $('#' + e).attr("cdx", "-1");
                $('#' + e).attr("pdx", "-1");
                $('#' + e + ' > .face-img > img').attr('src', 'resources/img_transparent.png');
            });
        } else {
            $('#' + posSel).css({background: '', border: '1px solid red'});
            $('#' + posSel + ' > div.card-text').text('');
            $('#' + posSel).attr("cdx", "-1");
            $('#' + posSel).attr("pdx", "-1");
            $('#' + posSel + ' > .face-img > img').attr('src', 'resources/img_transparent.png');
        }
    }
}


function clearData() {
    document.querySelectorAll('.position').forEach(function(e) {
        $('#' + e.id).css({background: '', border: '1px solid red'});
        $('#' + e.id + ' > div.card-text').text('');
        $('#' + e.id).attr("cdx", "-1");
        $('#' + e.id).attr("pdx", "-1");
        $('#' + e.id + ' > .face-img > img').attr('src', 'resources/img_transparent.png');
    });
}



function readFile (file) {
	var url = window.URL.createObjectURL (file);
	var reader = new FileReader ();
	reader.onload = function (e) {
		var filetext = reader.result;
		data = JSON.parse(filetext);
        applyData();
	}
	reader.readAsText (file);
}

function openDialogCommand (fileTypes) {
	var theDialog = $("<input type=\"file\" accept=\"" + fileTypes + "\" style=\"display: none;\">");
	$(theDialog).change (function (event) {
		if (this.files.length > 0) {
			readFile (this.files [0]);
			}
		});
	$("body").append (theDialog);
	$(theDialog).trigger ("click"); 
}

function loadData() {
	openDialogCommand (".json");
}
