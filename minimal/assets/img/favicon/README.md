# Create new Favicon

1) Go to https://realfavicongenerator.net/

2) Upload signet svg file

3.1) iOS Settings:

    - Add a solid, plain background to fill the transparent region
    - Background color: #ffffff
    - Margin size (for a 57x57 icon): 10px

3.2) Android / Android-Chrome

    - Add a solid, plain background to fill the transparent regions.
    - Background color: #ffffff
    - Margin size (for a 96x96 icon): 13px
    - App name: KeyHelp
    - Theme color: #ffffff

3.3) Windows Metro

    - Use this color (preferably, choose one suggested for the Windows Metro UI): #2b5797 ( Dark Blue)
    - Use a white silhouette version of the favicon. Works well with pictures with significant transparent regions.

3.4) macOS

    - Use a silhouette of the original image. Works well with pictures with significant transparent regions.
    - Theme color: #2b5797

4) Favicon Generator Options

    - Path: /theme/bulma/assets/favicon
    - The web site is already in production and many people already visited it. I want returning visitors to see my new favicon, not the old one.
        (There are also config files in the favicon folder, which contains the cache busting parameter)
    - Compression: Very high quality, very low compression factor
    - Specific app name, override the page title: KeyHelp

5) Generate your Favicons and HTML code

6) Replace all files in this favicon folder, but not the README.me, update the favicon stuff in <head>...</head>