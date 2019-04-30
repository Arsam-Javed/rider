import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {
    ActionSheetController, AlertController, IonicPage, LoadingController, NavController, NavParams, Platform,
    ToastController
} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {AppMinimize} from "@ionic-native/app-minimize";
declare var google: any;
/**
 * Generated class for the MapLivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-map-live',
    templateUrl: 'map-live.html',
})
export class MapLivePage {
    @ViewChild('map') mapElement: ElementRef;
    loaded: boolean = false;
    location: any = {};
    map: any;
    loading: any;
    marker: Array<any> = [];
    catIcon: Object = {
        url: 'assets/icon/location/rider.png',
        size: new google.maps.Size(45, 65),
        scaledSize: new google.maps.Size(45, 65),
        origin: new google.maps.Point(0,0)
    };
    destIcon: Object = {
        url: 'assets/icon/location/location.png',
        size: new google.maps.Size(45, 65),
        scaledSize: new google.maps.Size(45, 65),
        origin: new google.maps.Point(0,0)
    };
    reached : boolean = false;
    c_order: any = {};
    // alert
    nomap: boolean = false;
    type: string = "pickup";
    manualaddress: string = "";
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public zone: NgZone,
                public platform: Platform,
                public alertCtrl: AlertController,
                public actionSheetCtrl: ActionSheetController,
                public geolocation: Geolocation,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public appMinimize: AppMinimize
                // private androidPermissions: AndroidPermissions
    ) {
        // console.log(localStorage.getItem('current_order'));
        if(localStorage.getItem('current_order')) {
            this.c_order = JSON.parse(localStorage.getItem('current_order'));
            this.type = this.c_order.type;
            this.loaded = true;
            if(this.type == "pickup" && this.c_order.order.pickup.location.location_type == 'map') {
                this.platform.ready().then(() => {
                    this.manualaddress =  this.c_order.order.pickup.location.address;
                    this.loadMaps()
                });
            }
            else if(this.type == "delivery" && this.c_order.order.delivery.location.location_type == 'map') {
                this.platform.ready().then(() => {
                    this.manualaddress =  this.c_order.order.delivery.location.address;
                    this.loadMaps()
                });
            }
            else if(this.type == "pickup"){
                this.nomap = true;
                this.manualaddress =  this.c_order.order.pickup.location.address;
            }
            else if(this.type == "delivery"){
                this.nomap = true;
                this.manualaddress =  this.c_order.order.delivery.location.address;
            }
        }
    }
    isAndroid() {
        return this.platform.is('android')
    }

    isiOS() {
        return this.platform.is('ios');
    }
    loadMaps() {
        if (!!google) {
            this.initializeMap();
        } else {
            this.errorAlert('Error', 'Something went wrong with the Internet Connection. Please check your Internet.')
        }
    }

    errorAlert(title, message) {
        let alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.loadMaps();
                    }
                }
            ]
        });
        alert.present();
    }
    reachedAlert(title, message) {
        let alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.loadMaps();
                    }
                }
            ]
        });
        alert.present();
    }
    initializeMap() {
        if(this.type == "pickup")
        {
            let directionsOptions = {
                polylineOptions: {
                    strokeColor: 'blue'
                },
                preserveViewport: true
            };
            let directionsService = new google.maps.DirectionsService();
            let directionsDisplay = new google.maps.DirectionsRenderer(directionsOptions);
            this.zone.run(() => {
                var mapEle = this.mapElement.nativeElement;
                this.map = new google.maps.Map(mapEle, {
                    zoom: 10,
                    center: { lat: this.c_order.order.pickup.location.location.lat, lng: this.c_order.order.pickup.location.location.lng},
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    disableDoubleClickZoom: false,
                    disableDefaultUI: true,
                    zoomControl: true,
                    scaleControl: true,
                });
                directionsDisplay.setMap(this.map);
                directionsDisplay.setOptions( { suppressMarkers: true } );
                this.addMarker({ lat: this.c_order.order.pickup.location.location.lat, lng: this.c_order.order.pickup.location.location.lng}, this.c_order.order.pickup.location.address, this.destIcon);
                let watch = this.geolocation.watchPosition({enableHighAccuracy: true,maximumAge: 8000});
                watch.subscribe((data) => {
                    if(data) {
                        let originlat = data.coords.latitude;
                        let originlong = data.coords.longitude;
                        if(google.maps.geometry.spherical
                                .computeDistanceBetween(new google.maps.LatLng(originlat, originlong),this.marker[0].position)<50){
                            if(!this.reached) {
                                alert('You have arrived!');
                            }
                            this.reached = true;
                        }
                        this.calculateRouteP(directionsService, directionsDisplay, originlat, originlong );
                    }
                }, err=>{
                    console.log(err);
                });
            });
        }
        else {
            let directionsOptions = {
                polylineOptions: {
                    strokeColor: 'blue'
                },
                preserveViewport: true
            };
            let directionsService = new google.maps.DirectionsService();
            let directionsDisplay = new google.maps.DirectionsRenderer(directionsOptions);
            this.zone.run(() => {
                var mapEle = this.mapElement.nativeElement;
                this.map = new google.maps.Map(mapEle, {
                    zoom: 10,
                    center: { lat: this.c_order.order.delivery.location.location.lat, lng: this.c_order.order.delivery.location.location.lng},
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    disableDoubleClickZoom: false,
                    disableDefaultUI: true,
                    zoomControl: true,
                    scaleControl: true,
                });
                directionsDisplay.setMap(this.map);
                directionsDisplay.setOptions( { suppressMarkers: true } );
                this.addMarker({ lat: this.c_order.order.delivery.location.location.lat, lng: this.c_order.order.delivery.location.location.lng}, this.c_order.order.delivery.location.address, this.destIcon);
                let watch = this.geolocation.watchPosition({enableHighAccuracy: true,maximumAge: 8000});
                watch.subscribe((data) => {
                    if(data) {
                        let originlat = data.coords.latitude;
                        let originlong = data.coords.longitude;
                        if(google.maps.geometry.spherical
                                .computeDistanceBetween(new google.maps.LatLng(originlat, originlong),this.marker[0].position)<50){
                            if(!this.reached) {
                                alert('You have arrived!');
                            }
                            this.reached = true;
                        }
                        this.calculateRouteD(directionsService, directionsDisplay, originlat, originlong );
                    }
                }, err=>{
                    console.log(err);
                });
            });
        }
    }
    calculateRouteP(directionService: any, directionsDisplay: any, originlat: any, originlong: any){
        let request = {
            origin: new google.maps.LatLng(originlat, originlong),
            destination: new google.maps.LatLng(this.c_order.order.pickup.location.location.lat, this.c_order.order.pickup.location.location.lng),
            travelMode: 'DRIVING'
        };
        directionService.route(request, (result, status)=>{
            if(status == 'OK')
            {
                directionsDisplay.setDirections(result);
                this.addMarker({ lat: originlat, lng: originlong}, 'Your Location', this.catIcon);
            }
        })
    }
    calculateRouteD(directionService: any, directionsDisplay: any, originlat: any, originlong: any){
        let request = {
            origin: new google.maps.LatLng(originlat, originlong),
            destination: new google.maps.LatLng(this.c_order.order.delivery.location.location.lat, this.c_order.order.delivery.location.location.lng),
            travelMode: 'DRIVING'
        };
        directionService.route(request, (result, status)=>{
            if(status == 'OK')
            {
                directionsDisplay.setDirections(result);
                this.addMarker({ lat: originlat, lng: originlong}, 'Your Location', this.catIcon);
            }
        })
    }
    getCurrentPosition() {
        this.loading = this.loadingCtrl.create({
            content: 'Locating You...'
        });
        this.loading.present();

        let locationOptions = { timeout: 10000, enableHighAccuracy: true };

        this.geolocation.getCurrentPosition(locationOptions).then(
            (position) => {
                this.loading.dismiss().then(() => {
                    let myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    let options = {
                        center: myPos,
                        zoom: 14
                    };
                    this.map.setOptions(options);
                    this.addMarker(myPos , '', this.destIcon);
                });
            },
            (error) => {
                this.loading.dismiss().then(() => {
                    this.showToast(error.message);
                });
            }
        )
    }
    setMapOnAll(map) {
        for (var i = 1; i < this.marker.length; i++) {
            this.marker[i].setMap(map);
        }
    }
    clearMarkers() {
        this.setMapOnAll(null);
    }
    addMarker(position, content, markertype) {
        this.clearMarkers();
        this.marker.splice(1);
        let marker = new google.maps.Marker({
            map: this.map,
            icon: markertype,
            position: position,
            optimized: false
        });
        this.marker.push(marker);
        this.addInfoWindow(marker, content);
        return marker;
    }

    showToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }
    addInfoWindow(marker, content) {
        this.zone.run(() => {
        });
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad MapLivePage');
    }
    ionViewWillEnter() {
        console.log('Entered');
        this.navCtrl.swipeBackEnabled = false;
        this.platform.registerBackButtonAction(() => {
                this.appMinimize.minimize();
        });
    }

    ionViewWillLeave() {
        this.platform.registerBackButtonAction(() => {
            this.navCtrl.pop();
        });
        this.navCtrl.swipeBackEnabled = true;
    }

}
