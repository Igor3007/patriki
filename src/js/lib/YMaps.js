function YMaps(option, ymaps){
    
    this.map = null;
    this.isInit = false;

    this.mapsParams = {
        container: 'inmap',
        params: {
          center: [55.714225, 37.848540],
          zoom: 14,
          controls: ['zoomControl', 'fullscreenControl']
        },
        ballonMobileMode: false,
        autoscale: false,
        points: []
    }

    this.init = function(onInitCallback){

        if(!this.isInit) {

            this.isInit = !this.isInit
            var _this = this
            console.info('init Ymaps')

            ymaps.ready(function () {

                // Создание экземпляра карты и его привязка к созданному контейнеру.
                _this.map = new ymaps.Map(''+_this.mapsParams.container+'',  _this.mapsParams.params , {
                    suppressMapOpenBlock: true,
                });

                _this.map.behaviors.disable('scrollZoom')
                
                onInitCallback(_this.isInit);
            })
        }
        
        
    }

    this.resizeContainer = function(){
        var _this = this;
        setTimeout(function(){
            _this.map.container.fitToViewport();
            //autoscale
            if(_this.mapsParams.autoscale){
                _this.autoScale()
            }
        }, 500)
    }

    this.autoScale = function(){
        var _this = this;
        _this.map.setBounds(_this.map.geoObjects.getBounds(), { checkZoomRange: true, zoomMargin: 100 });
    }

    this.addPlacemark = function(arrayPoints){

            var _this = this;
            this.mapsParams.points = arrayPoints;
            this.map.geoObjects.removeAll();

            var sizeIcons = [30, 45];
            var offsetIcons = [8, 9]; 
            var placemarkOffset = [-15, -45];
        
            try {
        
                var PlacemarkArr = [];

                
        
                for (let i = 0; i < _this.mapsParams.points.length; i++) {

                    var item = _this.mapsParams.points[i];

                    // Создание метки  
                    PlacemarkArr[i] = new ymaps.Placemark(item.coordinates.split(','), {
                        balloonContentHeader: item.companyName, 
                        balloonContentBody: item.phone.replace(',', '<br>'),
                        balloonContentFooter: item.address,
                        hintContent: item.companyName,
                    }, {
                        iconLayout: 'default#imageWithContent',
                        iconImageHref: item.markerImage,
                        iconImageSize: sizeIcons,
                        iconImageOffset: placemarkOffset,
                        pane: 'balloon',
                        iconContentOffset: offsetIcons,
                        iconContentLayout: _this.MyIconContentLayout,
                        draggable: false
                    });
        
                    _this.map.geoObjects.add(PlacemarkArr[i]);
        
                }// endfor
        
        
            } catch(err) {
                console.error('error: YM addPlacemark ', err)
            }
    },

    this.changeCenter = function(point){

        //point string 

        this.map.setCenter(point.split(','), 15, {
            checkZoomRange: true
        });
    }

}