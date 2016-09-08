import { Component, EventEmitter, Output } from "@angular/core";

import { EmojiService } from "./emoji-service";

@Component({
    selector: "emoji",
    templateUrl: "emoji.component.html",
    styleUrls: [ "emoji.component.css" ]
})
export class EmojiComponent {
    private emoji_code_points = [];
    private current_tab: HTMLButtonElement = null;
    private current_page: HTMLDivElement = null;

    private selected_tab_class = "selected-item";

    @Output() onSelect = new EventEmitter<string>();

    constructor(private emoji: EmojiService) {
        this.emoji_code_points = emoji.getEmojiChars();
    }

    ngOnInit() {
        let emoji_wrapper = document.getElementById("emoji_wrapper");
        for (let i = 0; i < emoji_wrapper.children.length; i++) {
            emoji_wrapper.children[i].innerHTML = twemoji.parse(emoji_wrapper.children[i].innerHTML);
        }
        let emoji_imgs = document.getElementsByClassName("emoji");
        for (let i = 0; i < emoji_imgs.length; i++) {
            let emoji_img = emoji_imgs.item(i) as HTMLImageElement;
            if (emoji_img) {
                emoji_img.onclick = () => this.selectEmoji(emoji_img.alt);
            }
        }
        let flags_img = document.getElementById("flags").getElementsByTagName("img");
        for (let i = 0; i < flags_img.length; i++) {
            flags_img.item(i).setAttribute("title", countries[flags_img.item(i).alt]);
        }
        this.current_tab = document.getElementsByClassName(this.selected_tab_class).item(0) as HTMLButtonElement;
        this.current_page = document.getElementById("default_page") as HTMLDivElement;
    }

    selectEmoji(emoji_code_point) {
        this.onSelect.emit(emoji_code_point);
    }

    selectTab(tab: HTMLButtonElement, page: HTMLDivElement) {
        let hidden_class = "hidden";

        this.current_tab.classList.remove(this.selected_tab_class);
        tab.classList.add(this.selected_tab_class);

        this.current_page.classList.add(hidden_class);
        page.classList.remove(hidden_class)

        this.current_tab = tab;
        this.current_page = page;
    }
}

const countries = {"🇦🇫": "Afghanistan", "🇦🇽": "Åland Islands", "🇦🇱": "Albania", "🇩🇿": "Algeria", "🇦🇸": "American Samoa", "🇦🇩": "Andorra", "🇦🇴": "Angola", "🇦🇮": "Anguilla", "🇦🇶": "Antarctica", "🇦🇬": "Antigua and Barbuda", "🇦🇷": "Argentina", "🇦🇲": "Armenia", "🇦🇼": "Aruba", "🇦🇨": "🇦🇨", "🇦🇺": "Australia", "🇦🇹": "Austria", "🇦🇿": "Azerbaijan", "🇧🇸": "Bahamas", "🇧🇭": "Bahrain", "🇧🇩": "Bangladesh", "🇧🇧": "Barbados", "🇧🇾": "Belarus", "🇧🇪": "Belgium", "🇧🇿": "Belize", "🇧🇯": "Benin", "🇧🇲": "Bermuda", "🇧🇹": "Bhutan", "🇧🇴": "Bolivia", "🇧🇦": "Bosnia and Herzegovina", "🇧🇼": "Botswana", "🇧🇻": "🇧🇻", "🇧🇷": "Brazil", "🇮🇴": "British Indian Ocean Territory", "🇻🇬": "British Virgin Islands", "🇧🇳": "Brunei", "🇧🇬": "Bulgaria", "🇧🇫": "Burkina Faso", "🇧🇮": "Burundi", "🇰🇭": "Cambodia", "🇨🇲": "Cameroon", "🇨🇦": "Canada", "🇮🇨": "🇮🇨", "🇨🇻": "Cape Verde", "🇧🇶": "🇧🇶", "🇰🇾": "Cayman Islands", "🇨🇫": "Central African Republic", "🇪🇦": "🇪🇦", "🇹🇩": "Chad", "🇨🇱": "Chile", "🇨🇳": "China", "🇨🇽": "Christmas Island", "🇨🇵": "🇨🇵", "🇨🇨": "Cocos Islands", "🇨🇴": "Colombia", "🇰🇲": "Comoros", "🇨🇬": "🇨🇬", "🇨🇩": "🇨🇩", "🇨🇰": "Cook Islands", "🇨🇷": "Costa Rica", "🇨🇮": "🇨🇮", "🇭🇷": "Croatia", "🇨🇺": "Cuba", "🇨🇼": "Curacao", "🇨🇾": "Cyprus", "🇨🇿": "Czech Republic", "🇩🇰": "Denmark", "🇩🇬": "🇩🇬", "🇩🇯": "Djibouti", "🇩🇲": "Dominica", "🇩🇴": "Dominican Republic", "🇪🇨": "Ecuador", "🇪🇬": "Egypt", "🇸🇻": "El Salvador", "🇬🇶": "Equatorial Guinea", "🇪🇷": "Eritrea", "🇪🇪": "Estonia", "🇪🇹": "Ethiopia", "🇪🇺": "🇪🇺", "🇫🇰": "Falkland Islands", "🇫🇴": "Faroe Islands", "🇫🇯": "Fiji", "🇫🇮": "Finland", "🇫🇷": "France", "🇬🇫": "🇬🇫", "🇵🇫": "French Polynesia", "🇹🇫": "🇹🇫", "🇬🇦": "Gabon", "🇬🇲": "Gambia", "🇬🇪": "Georgia", "🇩🇪": "Germany", "🇬🇭": "Ghana", "🇬🇮": "Gibraltar", "🇬🇷": "Greece", "🇬🇱": "Greenland", "🇬🇩": "Grenada", "🇬🇵": "🇬🇵", "🇬🇺": "Guam", "🇬🇹": "Guatemala", "🇬🇬": "Guernsey", "🇬🇳": "Guinea", "🇬🇼": "Guinea-Bissau", "🇬🇾": "Guyana", "🇭🇹": "Haiti", "🇭🇲": "🇭🇲", "🇭🇳": "Honduras", "🇭🇰": "Hong Kong", "🇭🇺": "Hungary", "🇮🇸": "Iceland", "🇮🇳": "India", "🇮🇩": "Indonesia", "🇮🇷": "Iran", "🇮🇶": "Iraq", "🇮🇪": "Ireland", "🇮🇲": "Isle of Man", "🇮🇱": "Israel", "🇮🇹": "Italy", "🇯🇲": "Jamaica", "🇯🇵": "Japan", "🇯🇪": "Jersey", "🇯🇴": "Jordan", "🇰🇿": "Kazakhstan", "🇰🇪": "Kenya", "🇰🇮": "Kiribati", "🇽🇰": "Kosovo", "🇰🇼": "Kuwait", "🇰🇬": "Kyrgyzstan", "🇱🇦": "Laos", "🇱🇻": "Latvia", "🇱🇧": "Lebanon", "🇱🇸": "Lesotho", "🇱🇷": "Liberia", "🇱🇾": "Libya", "🇱🇮": "Liechtenstein", "🇱🇹": "Lithuania", "🇱🇺": "Luxembourg", "🇲🇴": "Macau", "🇲🇰": "Macedonia", "🇲🇬": "Madagascar", "🇲🇼": "Malawi", "🇲🇾": "Malaysia", "🇲🇻": "Maldives", "🇲🇱": "Mali", "🇲🇹": "Malta", "🇲🇭": "Marshall Islands", "🇲🇶": "🇲🇶", "🇲🇷": "Mauritania", "🇲🇺": "Mauritius", "🇾🇹": "Mayotte", "🇲🇽": "Mexico", "🇫🇲": "Micronesia", "🇲🇩": "Moldova", "🇲🇨": "Monaco", "🇲🇳": "Mongolia", "🇲🇪": "Montenegro", "🇲🇸": "Montserrat", "🇲🇦": "Morocco", "🇲🇿": "Mozambique", "🇲🇲": "Myanmar", "🇳🇦": "Namibia", "🇳🇷": "Nauru", "🇳🇵": "Nepal", "🇳🇱": "Netherlands", "🇳🇨": "New Caledonia", "🇳🇿": "New Zealand", "🇳🇮": "Nicaragua", "🇳🇪": "Niger", "🇳🇬": "Nigeria", "🇳🇺": "Niue", "🇳🇫": "🇳🇫", "🇲🇵": "🇲🇵", "🇰🇵": "North Korea", "🇳🇴": "Norway", "🇴🇲": "Oman", "🇵🇰": "Pakistan", "🇵🇼": "Palau", "🇵🇸": "Palestine", "🇵🇦": "Panama", "🇵🇬": "Papua New Guinea", "🇵🇾": "Paraguay", "🇵🇪": "Peru", "🇵🇭": "Philippines", "🇵🇳": "Pitcairn", "🇵🇱": "Poland", "🇵🇹": "Portugal", "🇵🇷": "Puerto Rico", "🇶🇦": "Qatar", "🇷🇪": "Reunion", "🇷🇴": "Romania", "🇷🇺": "Russia", "🇷🇼": "Rwanda", "🇼🇸": "Samoa", "🇸🇲": "San Marino", "🇸🇹": "Sao Tome and Principe", "🇸🇦": "Saudi Arabia", "🇸🇳": "Senegal", "🇷🇸": "Serbia", "🇸🇨": "Seychelles", "🇸🇱": "Sierra Leone", "🇸🇬": "Singapore", "🇸🇽": "Sint Maarten", "🇸🇰": "Slovakia", "🇸🇮": "Slovenia", "🇸🇧": "Solomon Islands", "🇸🇴": "Somalia", "🇿🇦": "South Africa", "🇬🇸": "🇬🇸", "🇰🇷": "South Korea", "🇸🇸": "South Sudan", "🇪🇸": "Spain", "🇱🇰": "Sri Lanka", "🇧🇱": "Saint Barthelemy", "🇸🇭": "Saint Helena", "🇰🇳": "Saint Kitts and Nevis", "🇱🇨": "Saint Lucia", "🇲🇫": "Saint Martin", "🇵🇲": "Saint Pierre and Miquelon", "🇻🇨": "Saint Vincent and the Grenadines", "🇸🇩": "Sudan", "🇸🇷": "Suriname", "🇸🇯": "Svalbard and Jan Mayen", "🇸🇿": "Swaziland", "🇸🇪": "Sweden", "🇨🇭": "Switzerland", "🇸🇾": "Syria", "🇹🇼": "Taiwan", "🇹🇯": "Tajikistan", "🇹🇿": "Tanzania", "🇹🇭": "Thailand", "🇹🇱": "🇹🇱", "🇹🇬": "Togo", "🇹🇰": "Tokelau", "🇹🇴": "Tonga", "🇹🇹": "Trinidad and Tobago", "🇹🇦": "🇹🇦", "🇹🇳": "Tunisia", "🇹🇷": "Turkey", "🇹🇲": "Turkmenistan", "🇹🇨": "Turks and Caicos Islands", "🇹🇻": "Tuvalu", "🇺🇬": "Uganda", "🇺🇦": "Ukraine", "🇦🇪": "United Arab Emirates", "🇬🇧": "United Kingdom", "🇺🇸": "United States", "🇺🇾": "Uruguay", "🇺🇲": "🇺🇲", "🇻🇮": "U.S. Virgin Islands", "🇺🇿": "Uzbekistan", "🇻🇺": "Vanuatu", "🇻🇦": "Vatican", "🇻🇪": "Venezuela", "🇻🇳": "Vietnam", "🇼🇫": "Wallis and Futuna", "🇪🇭": "Western Sahara", "🇾🇪": "Yemen", "🇿🇲": "Zambia", "🇿🇼": "Zimbabwe"};

/* for images
 emoji_codes = ["D83DDE0A","D83DDE03","D83DDE09","D83DDE06","D83DDE1C","D83DDE0B","D83DDE0D","D83DDE0E","D83DDE12","D83DDE0F","D83DDE14","D83DDE22","D83DDE2D","D83DDE29","D83DDE28","D83DDE10","D83DDE0C","D83DDE07","D83DDE30","D83DDE32","D83DDE33","D83DDE37","D83DDE1A","D83DDE20","D83DDE21","D83DDE08","D83DDC4D","D83DDC4E","D83DDC4C","D83DDE04","D83DDE02","D83DDE15","D83DDE2F","D83DDE26","D83DDE35","D83DDE1D","D83DDE34","D83DDE18","D83DDE1F","D83DDE2C","D83DDE36","D83DDE2A","D83DDE2B","D83DDE00","D83DDE25","D83DDE1B","D83DDE16","D83DDE24","D83DDE23","D83DDE27","D83DDE11","D83DDE05","D83DDE2E","D83DDE1E","D83DDE19","D83DDE13","D83DDE01","D83DDE31","D83DDC7F","D83DDC7D","D83DDC4F","D83DDC4A","D83DDE4F","D83DDC43","D83DDC46","D83DDC47","D83DDC48","D83DDCAA","D83DDC42","D83DDC8B","D83DDCA9","D83CDF4A","D83CDF77","D83CDF78","D83CDF85","D83DDCA6","D83DDC7A","D83DDC28","D83DDD1E","D83DDC79","D83CDF1F","D83CDF4C","D83CDF7A","D83CDF7B","D83CDF39","D83CDF45","D83CDF52","D83CDF81","D83CDF82","D83CDF84","D83CDFC1","D83CDFC6","D83DDC0E","D83DDC0F","D83DDC1C","D83DDC2B","D83DDC2E","D83DDC03","D83DDC3B","D83DDC3C","D83DDC05","D83DDC13","D83DDC18","D83DDC94","D83DDCAD","D83DDC36","D83DDC31","D83DDC37","D83DDC11","D83CDF3A","D83CDF3B","D83CDF3C","D83CDF3D","D83CDF4B","D83CDF4D","D83CDF4E","D83CDF4F","D83CDF6D","D83CDF37","D83CDF38","D83CDF46","D83CDF49","D83CDF50","D83CDF51","D83CDF53","D83CDF54","D83CDF55","D83CDF56","D83CDF57","D83CDF69","D83CDF83","D83CDFAA","D83CDFB1","D83CDFB2","D83CDFB7","D83CDFB8","D83CDFBE","D83CDFC0","D83CDFE6","D83DDE38","D83DDE39","D83DDE3C","D83DDE3D","D83DDE3E","D83DDE3F","D83DDE3B","D83DDE40","D83DDE3A","D83CDC04","D83CDCCF","D83CDD98","D83CDF02","D83CDF0D","D83CDF1B","D83CDF1D","D83CDF1E","D83CDF30","D83CDF31","D83CDF32","D83CDF33","D83CDF34","D83CDF35","D83CDF3E","D83CDF3F","D83CDF40","D83CDF41","D83CDF42","D83CDF43","D83CDF44","D83CDF47","D83CDF48","D83CDF5A","D83CDF5B","D83CDF5C","D83CDF5D","D83CDF5E","D83CDF5F","D83CDF60","D83CDF61","D83CDF62","D83CDF63","D83CDF64","D83CDF65","D83CDF66","D83CDF67","D83CDF68","D83CDF6A","D83CDF6B","D83CDF6C","D83CDF6E","D83CDF6F","D83CDF70","D83CDF71","D83CDF72","D83CDF73","D83CDF74","D83CDF75","D83CDF76","D83CDF79","D83CDF7C","D83CDF80","D83CDF88","D83CDF89","D83CDF8A","D83CDF8B","D83CDF8C","D83CDF8D","D83CDF8E","D83CDF8F","D83CDF90","D83CDF92","D83CDF93","D83CDFA3","D83CDFA4","D83CDFA7","D83CDFA8","D83CDFA9","D83CDFAB","D83CDFAC","D83CDFAD","D83CDFAF","D83CDFB0","D83CDFB3","D83CDFB4","D83CDFB9","D83CDFBA","D83CDFBB","D83CDFBD","D83CDFBF","D83CDFC2","D83CDFC3","D83CDFC4","D83CDFC7","D83CDFC8","D83CDFC9","D83CDFCA","D83DDC00","D83DDC01","D83DDC02","D83DDC04","D83DDC06","D83DDC07","D83DDC08","D83DDC09","D83DDC0A","D83DDC0B","D83DDC0C","D83DDC0D","D83DDC10","D83DDC12","263A","270B","2744","26BD","26C5","23F3","26BE","26C4","2600","23F0","2601","260E","2615","267B","26A0","26A1","26D4","26EA","26F3","26F5","26FD","2702","2708","2709","270A","270F","2712","2728"]; */