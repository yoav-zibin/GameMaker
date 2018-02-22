//this code read data from universalgamemaker-export.json,
//list gamespecId and corresponding name in GameOut.txt
//list imageId and corresponding name in ImageOut.txt
//list gamespecId and imageId which have same name, and their common name in resOut.txt 

import java.io.*;
import java.util.*;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;


public class readJsonFile{

    public static void main(String[] args) {

        JSONParser parser = new JSONParser();
        String fileNameImage="GamesScreenshots";
        String fileName="output\\GameOut.txt";
        String fileName2="output\\ImageOut.txt";
        String fileName3="output\\resOut.txt";
        String readPath = "universalgamemaker-export.json";

        try {

            JSONObject universalgamemakerObj = (JSONObject)parser.parse(new FileReader(readPath));
            JSONObject gameBuilderObj = (JSONObject)universalgamemakerObj.get("gameBuilder");
            JSONObject gameSpecsObj = (JSONObject)gameBuilderObj.get("gameSpecs");
            JSONObject imagesObj = (JSONObject)gameBuilderObj.get("images");
            HashMap<String, String> gameSpecsMap = new HashMap<>();
            HashMap<String, String> imagesMap = new HashMap<>();
            ArrayList<ArrayList<String>> res = new ArrayList<>();

            File file=new File(fileNameImage);
            File[] fileArray = file.listFiles();
            Set<String> fileSet = new HashSet<>();
            for(int i = 0;i < fileArray.length; i++){
                String path = fileArray[i].getName();
                String[] pathArray = path.split("\\.");
                fileSet.add(pathArray[0]);
            }

            FileWriter writer=new FileWriter(fileName);
            for (Object o : gameSpecsObj.keySet())
            {
                String gameSpecsId = o.toString();
                JSONObject gameSpecs = (JSONObject) gameSpecsObj.get(gameSpecsId);
                String gameName = (String) gameSpecs.get("gameName");
                String gameNameS = gameName.trim().toLowerCase().replaceAll("\\s*", "").replaceAll("-", "").replaceAll("_", "");
                gameSpecsMap.put(gameNameS, gameSpecsId);
                writer.write(gameName + "\n");
                writer.write(gameSpecsId + "\n");
                writer.write("\n");
            }
            writer.write("length of gameSpecs "+ gameSpecsMap.size());
            writer.close();

            FileWriter writer2=new FileWriter(fileName2);
            for (Object o : imagesObj.keySet())
            {
                String imageId = o.toString();
                JSONObject image = (JSONObject) imagesObj.get(imageId);
                String name = (String) image.get("name");
                imagesMap.put(name.trim().toLowerCase().replaceAll("\\s*", "").replaceAll("-", "").replaceAll("_", ""), imageId);
                writer2.write(name + "\n");
                writer2.write(imageId + "\n");
                writer2.write("\n");
            }
            writer2.write("length of images "+ imagesMap.size());
            writer2.close();

            FileWriter writer3=new FileWriter(fileName3);
            writer3.write("Name" + "\n");
            writer3.write("GameId" + "\n");
            writer3.write("ImageId" + "\n");
            writer3.write("\n");
            int count = 0;
            for (String keyTemp : fileSet) {
                String key = keyTemp.trim().toLowerCase().replaceAll("\\s*", "").replaceAll("-", "").replaceAll("_", "");
                if (imagesMap.containsKey(key)) {
                    count++;
                    ArrayList<String> tmp = new ArrayList<>();
                    tmp.add(key);
                    tmp.add(gameSpecsMap.get(key));
                    tmp.add(imagesMap.get(key));
                    res.add(tmp);
                    writer3.write(key + "\n");
                    writer3.write(gameSpecsMap.get(key) + "\n");
                    writer3.write(imagesMap.get(key) + "\n");
                }
            }
            
            writer3.close();

            System.out.println(count);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }


}
