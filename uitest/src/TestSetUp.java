import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;

import java.util.*;

public class TestSetUp {
    private WebDriver driver;

    public void createDriver() {
        //driver = new RemoteWebDriver(service.getUrl(), DesiredCapabilities.chrome());
        System.setProperty("webdriver.chrome.driver", "/path/to/your/chromedriver");
        driver = new ChromeDriver();
    }

    public void testHomePage() {
        driver.get("https://yoav-zibin.github.io/GameBuilder/");
        driver.manage().window().maximize();

    }

    public void testLogin() {
        WebElement loginButton = driver.findElements(By.tagName("button")).get(0);
        loginButton.click();
        List<WebElement> formList = driver.findElements(By.tagName("input"));
        formList.get(0).sendKeys("your user name");
        formList.get(1).sendKeys("your password");
        driver.findElements(By.tagName("button")).get(1).click();
    }

    public void testUploadImage() {
        try {
            Thread.sleep(1000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        driver.findElement(By.xpath("//input[@type='file']")).sendKeys("/Users/luoyangyang/Documents/Master/SocialMultiplayerGames/Assignment/game.png");
        driver.findElement(By.xpath("//input[@type='text']")).sendKeys("test");
        driver.findElements(By.tagName("button")).get(2).click();
        driver.findElement(By.xpath("//input[@type='checkbox']")).click();
        driver.findElements(By.tagName("button")).get(2).click();
    }

    public void testCreateStandardElement() {
        try {
            Thread.sleep(1000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        driver.findElements(By.tagName("span")).get(2).click();
        List<WebElement> checkboxes = driver.findElements(By.xpath("//input[@type='checkbox']"));
        checkboxes.get(0).click();
        driver.findElements(By.tagName("input")).get(3).sendKeys("testStandardElement");
        driver.findElements(By.tagName("button")).get(3).click();

        try {
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List<WebElement> images = driver.findElements(By.tagName("img"));
        int len = images.size();
        int x = (int)(Math.random() * len);
        images.get(x).click();
        driver.findElements(By.tagName("button")).get(2).click();
    }

    public void testBuildSimpleSpec() {
        try {
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        driver.findElement(By.xpath("//span[@value='/build']")).click();
        try {
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List<WebElement> images = driver.findElements(By.tagName("img"));
        images.get(0).click();
        driver.findElements(By.tagName("button")).get(3).click();
        //driver.findElements(By.tagName("input")).get(0).sendKeys("standard");
        try {
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }

        /*
        driver.findElements(By.tagName("button")).get(2).click();
        try {
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        driver.findElements(By.tagName("span")).get(10).click();
        */
        List<WebElement> elements = driver.findElements(By.tagName("img"));
        WebElement source = elements.get(0);
        WebElement target = driver.findElements(By.tagName("canvas")).get(1);
        try {
            Thread.sleep(5000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Actions actions = new Actions(driver);
        actions.dragAndDrop(source, target).perform();
        driver.findElements(By.tagName("button")).get(5).click();
        try {
            Thread.sleep(10000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        driver.findElements(By.tagName("button")).get(5).click();
        try {
            Thread.sleep(5000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        driver.findElements(By.tagName("button")).get(3).click();
        try {
            Thread.sleep(5000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        driver.findElement(By.tagName("input")).sendKeys("testSpec");
        driver.findElements(By.tagName("button")).get(3).click();
    }

    public void testUpdateSpec() {
        try {
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        driver.findElement(By.xpath("//span[@value='/update']")).click();
        try {
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List<WebElement> images = driver.findElements(By.tagName("img"));
        try {
            Thread.sleep(2000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        images.get(2).click();
        driver.findElements(By.tagName("button")).get(2).click();

        List<WebElement> elements = driver.findElements(By.tagName("img"));
        WebElement source = elements.get(0);
        WebElement target = driver.findElement(By.className("konvajs-content"));
        try {
            Thread.sleep(5000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Actions actions = new Actions(driver);
        actions.dragAndDrop(source, target).perform();
    }

    public void stopService() {
        driver.quit();
    }

    public static void main(String[] args) {
        TestSetUp ts = new TestSetUp();
        ts.createDriver();
        ts.testHomePage();
        ts.testLogin();
        ts.testUploadImage();
        ts.testCreateStandardElement();
        ts.testBuildSimpleSpec();
        //ts.testUpdateSpec();
        //ts.stopService();
    }
}
