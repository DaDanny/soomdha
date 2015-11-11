##Soomdoha App
----

####TO DO 

A couple of things for you to do:

* In app.js (under the www directory) on line 34, I initialize it to my parse account. You already had a parse account setup, but I setup my own for testing, so make sure you change the keys to your account keys.
* If you want to make changes to the styles.scss file, make sure in another terminal window you navigate to the root folder (soomdha/) and run gulp watch, so any changes made in a scss file are compiled to CSS. 
* Under the main.js file, I included "Women" and "Phones" but I wasn't sure how to spell it in your language, so make sure you do that.

* Other than that, you should be all set. Please let me know if you find anything wrong, or need help with anything. I'm more than happy to assist you.

----
Best of luck and if you'd like any help with business planning or marketing strategy, my business partner has over 15 years of experience in that field and would happily help you.

** Must include for pictures to work on iOS ( I already fixed this, but if you remove the ios platform, you may have to add this)
```objective-c
<key>NSAppTransportSecurity</key>
    <dict>
      <key>NSExceptionDomains</key>
      <dict>
        <key>files.parsetfss.com</key>
        <dict>
          <key>NSIncludeSubdomains</key>
          <true/>
          <key>NSExceptionAllowsInsecureHTTPLoads</key>
          <true/>
        </dict>
      </dict>
    </dict>
```
    
    