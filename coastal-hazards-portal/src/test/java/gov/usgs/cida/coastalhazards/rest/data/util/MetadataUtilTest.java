/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.coastalhazards.rest.data.util;

import gov.usgs.cida.coastalhazards.model.Bbox;
import gov.usgs.cida.coastalhazards.model.Service;
import gov.usgs.cida.coastalhazards.xml.model.Bounding;
import gov.usgs.cida.coastalhazards.xml.model.Geodetic;
import gov.usgs.cida.coastalhazards.xml.model.Horizsys;
import gov.usgs.cida.coastalhazards.xml.model.Idinfo;
import gov.usgs.cida.coastalhazards.xml.model.Metadata;
import gov.usgs.cida.coastalhazards.xml.model.Spdom;
import gov.usgs.cida.coastalhazards.xml.model.Spref;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.Scanner;
import java.util.Set;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import org.apache.commons.io.FileUtils;
import org.geotools.referencing.CRS;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Ignore;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.ReferenceIdentifier;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.cs.CoordinateSystem;
import org.slf4j.LoggerFactory;

public class MetadataUtilTest {

    public MetadataUtilTest() {

    }
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(MetadataUtilTest.class);
    private static File workDir; // place to copy
    private static final String tempDir = System.getProperty("java.io.tmpdir");
    private static String AExml = "ne_AEmeta.xml";
    private static String PAExml = "ne_PAEmeta.xml";
    private static String CRxml = "ne_CRmeta.xml";

    @BeforeClass
    public static void setUpClass() throws IOException {
        workDir = new File(tempDir, String.valueOf(new Date().getTime()));
        FileUtils.deleteQuietly(workDir);
        FileUtils.forceMkdir(workDir);
    }

    @AfterClass
    public static void tearDownClass() {
        FileUtils.deleteQuietly(workDir);
    }

    @Before
    public void setUp() throws IOException, URISyntaxException {
        String packagePath = "/";
        FileUtils.copyDirectory(new File(getClass().getResource(packagePath).toURI()), workDir);

    }

    @After
    public void tearDown() {
        // FileUtils.listFiles(workDir, null, true).stream().forEach((file) -> {
        //FileUtils.deleteQuietly(file);
        //});
        Collection<File> files = FileUtils.listFiles(workDir, null, true);
        for (File file : files) {
            FileUtils.deleteQuietly(file);
        }
    }

    /**
     * Test of doCSWInsertFromUploadId method, of class MetadataUtil.
     */
    @Ignore
    @Test
    public void testDoCSWInsertFromUploadId() throws Exception {
        System.out.println("doCSWInsertFromUploadId");
        String metadataId = "";
        String expResult = "";
        String result = MetadataUtil.doCSWInsertFromUploadId(metadataId);
        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of doCSWInsertFromString method, of class MetadataUtil.
     */
    @Ignore
    @Test
    public void testDoCSWInsertFromString() throws Exception {
        System.out.println("doCSWInsertFromString");
        String metadata = null;
        String expResult = "";
        String result = MetadataUtil.doCSWInsertFromString(metadata);
        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of stripXMLProlog method, of class MetadataUtil.
     */
    @Ignore
    @Test
    public void testStripXMLProlog() {
        System.out.println("stripXMLProlog");
        String xml = "";
        String expResult = "";
        String result = MetadataUtil.stripXMLProlog(xml);
        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of getSummaryFromWPS method, of class MetadataUtil.
     */
    @Ignore
    @Test
    public void testGetSummaryFromWPS() throws Exception {
        System.out.println("getSummaryFromWPS");
        String metadataEndpoint = "";
        String attr = "";
        String expResult = "";
        String result = MetadataUtil.getSummaryFromWPS(metadataEndpoint, attr);
        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of extractMetadataFromShp method, of class MetadataUtil.
     */
    @Ignore
    @Test
    public void testExtractMetadataFromShp() {
        System.out.println("extractMetadataFromShp");
        InputStream is = null;
        String expResult = "";
        String result = MetadataUtil.extractMetadataFromShp(is);
        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of getMetadataByIdUrl method, of class MetadataUtil.
     */
    @Ignore
    @Test
    public void testGetMetadataByIdUrl() {
        System.out.println("getMetadataByIdUrl");
        String id = "";
        String expResult = "";
        String result = MetadataUtil.getMetadataByIdUrl(id);
        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of makeCSWServiceForUrl method, of class MetadataUtil.
     */
    @Ignore
    @Test
    public void testMakeCSWServiceForUrl() {
        System.out.println("makeCSWServiceForUrl");
        String url = "";
        Service expResult = null;
        Service result = MetadataUtil.makeCSWServiceForUrl(url);
        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of getBoundingBoxFromFgdcMetadataCR method, of class MetadataUtil.
     */
    @Test
    public void testGetBoundingBoxFromFgdcMetadataCR() throws IOException {
        System.out.println("testGetBoundingBoxFromFgdcMetadataPAE");
        // This method tests the parsing that occurs in: Bbox result = MetadataUtil.getBoundingBoxFromFgdcMetadata(metadata); // file is ~40kb
        // spdom is the WGS84 bbox, format for the Bbox is "BOX(%f %f, %f %f)"

        //get the metadata from the test file as a string using this package to locate it ...
        String packageName = this.getClass().getCanonicalName();
        System.out.println("PackageName: " + packageName); //PackageName: gov.usgs.cida.coastalhazards.rest.data.util.MetadataUtilTest
        // this is where the test resource is located - gov.usgs.cida.coastalhazards.rest.data + /ne_AEmeta.xml
        String replaced = packageName.replaceAll("[.]", "/");
        String[] names = replaced.split("/util/MetadataUtilTest");
        String packageNameShort = names[0];
        String testFileFullName = packageNameShort + "/" + CRxml;

        String metadataXml = loadResourceAsString(testFileFullName);

        InputStream in = new ByteArrayInputStream(metadataXml.getBytes("UTF-8"));
        Metadata metadata = null;

        // JAXB will require jaxb-api.jar and jaxb-impl.jar part of java 1.6. Much safer way to interrogate xml and maintain than regex
        try {
            //File file = new File(xmlFile);  // FYI: can also be done via file rather than inputStream
            JAXBContext jaxbContext = JAXBContext.newInstance(Metadata.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            metadata = (Metadata) jaxbUnmarshaller.unmarshal(in);

        } catch (JAXBException e) {
            e.printStackTrace();
        }

        assertNotNull(metadata);
        Idinfo idinfo = metadata.getIdinfo();
        Spdom spdom = idinfo.getSpdom();
        Bounding bounding = spdom.getBounding();

        double minx = bounding.getWestbc();
        double miny = bounding.getSouthbc();
        double maxx = bounding.getEastbc();
        double maxy = bounding.getNorthbc();

        Bbox result = new Bbox();
        result.setBbox(minx, miny, maxx, maxy);

        System.out.println("Parsed Bbox is: " + result.getBbox());

        Bbox expResult = new Bbox();
        expResult.setBbox("BOX(-77.830618 35.344738, -66.813170 46.642941)");

        assertNotNull(result);
        assertTrue(expResult.getBbox().startsWith("BOX(-77.830618 35."));
        assertTrue(expResult.getBbox().equalsIgnoreCase(result.getBbox()));
    }

    /**
     * Test of getBoundingBoxFromFgdcMetadataAE method, of class MetadataUtil.
     */
    @Test

    public void testGetBoundingBoxFromFgdcMetadataAE() throws IOException {
        System.out.println("testGetBoundingBoxFromFgdcMetadataAE");
        // This method tests the parsing that occurs in: Bbox result = MetadataUtil.getBoundingBoxFromFgdcMetadata(metadata); // file is ~40kb
        // spdom is the WGS84 bbox, format for the Bbox is "BOX(%f %f, %f %f)"

        //get the metadata from the test file as a string using this package to locate it ...
        String packageName = this.getClass().getCanonicalName();
        System.out.println("PackageName: " + packageName); //PackageName: gov.usgs.cida.coastalhazards.rest.data.util.MetadataUtilTest
        // this is where the test resource is located - gov.usgs.cida.coastalhazards.rest.data + /ne_AEmeta.xml
        String replaced = packageName.replaceAll("[.]", "/");
        String[] names = replaced.split("/util/MetadataUtilTest");
        String packageNameShort = names[0];
        String testFileFullName = packageNameShort + "/" + AExml;

        String metadataXml = loadResourceAsString(testFileFullName);

        InputStream in = new ByteArrayInputStream(metadataXml.getBytes("UTF-8"));
        Metadata metadata = null;

        // JAXB will require jaxb-api.jar and jaxb-impl.jar part of java 1.6. Much safer way to interrogate xml and maintain than regex
        try {
            //File file = new File(xmlFile);  // FYI: can also be done via file rather than inputStream
            JAXBContext jaxbContext = JAXBContext.newInstance(Metadata.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            metadata = (Metadata) jaxbUnmarshaller.unmarshal(in);

        } catch (JAXBException e) {
            e.printStackTrace();
        }

        assertNotNull(metadata);
        Idinfo idinfo = metadata.getIdinfo();
        Spdom spdom = idinfo.getSpdom();
        Bounding bounding = spdom.getBounding();

        double minx = bounding.getWestbc();
        double miny = bounding.getSouthbc();
        double maxx = bounding.getEastbc();
        double maxy = bounding.getNorthbc();

        Bbox result = new Bbox();
        result.setBbox(minx, miny, maxx, maxy);

        System.out.println("Parsed Bbox is: " + result.getBbox());

        Bbox expResult = new Bbox();
        expResult.setBbox("BOX(-77.830618 35.344738, -66.813170 46.642941)");

        assertNotNull(result);
        assertTrue(expResult.getBbox().startsWith("BOX(-77.830618 35."));
        assertTrue(expResult.getBbox().equalsIgnoreCase(result.getBbox()));
    }

    private String loadResourceAsString(String fileName) throws IOException {
        Scanner scanner = new Scanner(getClass().getClassLoader().getResourceAsStream(fileName));
        String contents = scanner.useDelimiter("\\A").next();
        scanner.close();
        return contents;
    }

    /**
     * Test of getCrsFromFgdcMetadata method, of class MetadataUtil.
     */
    @Test
    public void testGetCrsFromFgdcMetadata() throws IOException {
        System.out.println("getCrsFromFgdcMetadata");
        //spref is used to determine hte SRS

        System.out.println("testGetBoundingBoxFromFgdcMetadataAE");

        //get the metadata from the test file as a string using this package to locate it ...
        String packageName = this.getClass().getCanonicalName();
        System.out.println("PackageName: " + packageName); //PackageName: gov.usgs.cida.coastalhazards.rest.data.util.MetadataUtilTest
        // this is where the test resource is located - gov.usgs.cida.coastalhazards.rest.data + /ne_AEmeta.xml
        String replaced = packageName.replaceAll("[.]", "/");
        String[] names = replaced.split("/util/MetadataUtilTest");
        String packageNameShort = names[0];
        String testFileFullName = packageNameShort + "/" + CRxml;

        String metadataXml = loadResourceAsString(testFileFullName);

        InputStream in = new ByteArrayInputStream(metadataXml.getBytes("UTF-8"));
        Metadata metadata = null;

        // JAXB will require jaxb-api.jar and jaxb-impl.jar part of java 1.6. Much safer way to interrogate xml and maintain than regex
        try {
            //File file = new File(xmlFile);  // FYI: can also be done via file rather than inputStream
            JAXBContext jaxbContext = JAXBContext.newInstance(Metadata.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            metadata = (Metadata) jaxbUnmarshaller.unmarshal(in);

        } catch (JAXBException e) {
            e.printStackTrace();
        }

        assertNotNull(metadata);

        //Spref spref = metadata.getSpref();
        Horizsys horizsys = metadata.getSpref().getHorizsys();

        assertNotNull(horizsys);

        String expEllips = "GRS 1980";
        String expHorizdn = "North American Datum 1983";
        double expDenflat = 298.257222101;
        double expSemiaxis = 6378137.0;

        // part I
        String ellips = horizsys.getGeodetic().getEllips();
        String horizdn = horizsys.getGeodetic().getHorizdn();
        double denflat = horizsys.getGeodetic().getDenflat();
        double semiaxis = horizsys.getGeodetic().getSemiaxis();

        assertTrue(expEllips.equalsIgnoreCase(ellips));
        assertTrue(expHorizdn.equalsIgnoreCase(horizdn));
        assertEquals(expDenflat, denflat, expDenflat - denflat);
        assertEquals(expSemiaxis, semiaxis, expSemiaxis - semiaxis);
        // part II
        String mapprojn = horizsys.getPlanar().getMapproj().getMapprojn();
        double feast = horizsys.getPlanar().getMapproj().getMapprojp().getFeast();
        double fnorth = horizsys.getPlanar().getMapproj().getMapprojp().getFnorth();
        double latprjo = horizsys.getPlanar().getMapproj().getMapprojp().getLatprjo();
        double longcm = horizsys.getPlanar().getMapproj().getMapprojp().getLongcm();
        double stdparll = horizsys.getPlanar().getMapproj().getMapprojp().getStdparll();

        String expMapprojn = "Albers Conical Equal Area";
        double expFeast = 0.0;
        double expFnorth = 0.0;
        double expLatprjo = 23.0;
        double expLongcm = -96.0;
        double expStdparll = 45.5; // the second of the two children

        assertTrue(expMapprojn.equalsIgnoreCase(mapprojn));
        assertEquals(expFeast, feast, expFeast - feast);
        assertEquals(expFnorth, fnorth, expFnorth - fnorth);
        assertEquals(expLatprjo, latprjo, expLatprjo - latprjo);
        assertEquals(expLongcm, longcm, expLongcm - longcm);
        assertEquals(expStdparll, stdparll, expStdparll - stdparll);
        //CoordinateReferenceSystem expResult = null;
        //CoordinateReferenceSystem result = MetadataUtil.getCrsFromFgdcMetadata(metadata);
        //assertEquals(expResult, result);

    }
    
    public void testBuildWKt(String ellips, String horizdn, double denflat, double semiaxis) {
        String replaceMe = "REPLACEME";
        final String lineSep = System.getProperty("line.separator", "\n");

        String wktExample = "GEOGCS[" + "\"GRS 1980\"," + "  DATUM[" + "    \"WGS_1984\","
                + "    SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],"
                + "    TOWGS84[0,0,0,0,0,0,0]," + "    AUTHORITY[\"EPSG\",\"6326\"]],"
                + "  PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],"
                + "  UNIT[\"DMSH\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9108\"]],"
                + "  AXIS[\"Lat\",NORTH]," + "  AXIS[\"Long\",EAST],"
                + "  AUTHORITY[\"EPSG\",\"4326\"]]";

        /*    PROJCRS["NAD83 / Conus Albers",
  BASEGEODCRS["NAD83",
    DATUM["North American Datum 1983",
      ELLIPSOID["GRS 1980",6378137,298.257222101,LENGTHUNIT["metre",1.0]]]],
  CONVERSION["Conus Albers",
    METHOD["Albers Equal Area",ID["EPSG",9822]],
    PARAMETER["Latitude of false origin",23,ANGLEUNIT["degree",0.01745329252]],
    PARAMETER["Longitude of false origin",-96,ANGLEUNIT["degree",0.01745329252]],
    PARAMETER["Latitude of 1st standard parallel",29.5,ANGLEUNIT["degree",0.01745329252]],
    PARAMETER["Latitude of 2nd standard parallel",45.5,ANGLEUNIT["degree",0.01745329252]],
    PARAMETER["Easting at false origin",0,LENGTHUNIT["metre",1.0]],
    PARAMETER["Northing at false origin",0,LENGTHUNIT["metre",1.0]]],
  CS[cartesian,2],
    AXIS["easting (X)",east,ORDER[1]],
    AXIS["northing (Y)",north,ORDER[2]],
    LENGTHUNIT["metre",1.0],
  ID["EPSG",5070]] */
        StringBuilder builder = new StringBuilder(500);

        builder.append("GEOGCS[");
        builder.append("\"");  // quote
        builder.append(replaceMe);  //ellips
        builder.append("\"");  // quote
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append("DATUM[");
        builder.append("\"");  // quote
        builder.append(replaceMe);  //horizdn
        builder.append("\"");  // quote
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append("SPHEROID[");
        builder.append("\"");  // quote
        builder.append(replaceMe); // WGS 84
        builder.append("\"");  // quote
        builder.append(",");   // comma                
        builder.append(replaceMe); //semiaxis
        builder.append(",");   // comma
        builder.append(replaceMe); //denflat
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append(getAuthorityText(12345));
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append(getAuthorityText(12345));
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append("PRIMEM[");
        builder.append("\"");  // quote
        builder.append(replaceMe);
        builder.append("\"");  // quote
        builder.append(",");
        builder.append(replaceMe);
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append(getAuthorityText(12345));
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append("UNIT[");
        builder.append("\"");  // quote
        builder.append(replaceMe);
        builder.append("\"");  // quote
        builder.append(",");
        builder.append(replaceMe);
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append(getAuthorityText(12345));
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append(getAuthorityText(12345));

        String wkt = builder.toString();

        System.out.println(wkt);
        assertNotNull(wkt);
    }

    private String getAuthorityText(int epsgCode) {
        StringBuilder builder = new StringBuilder(300);
        builder.append("AUTHORITY[");
        builder.append("\"");  // quote
        builder.append("EPSG");
        builder.append("\"");  // quote
        builder.append(",");
        builder.append("\"");  // quote
        builder.append(epsgCode);
        builder.append("\"");  // quote
        builder.append("]]");

        return builder.toString();
    }

    @Test
    public void testAnotherStringWKTBuilder() throws FactoryException {
        final String lineSep = System.getProperty("line.separator", "\n");

        String ellips = "GRS 1980";
        String horizdn = "North American Datum 1983";
        double denflat = 298.257222101;
        double semiaxis = 6378137.0;

        String mapprojn = "Albers Conical Equal Area";
        double feast = 0.0;
        double fnorth = 0.0;
        double latprjo = 23.0;
        double longcm = -96.0;
        double stdparll = 45.5; // the second of the two children     

        String defaultGcs = "GCS_North_American_1983";
        String defaultPrimeM = "Greenwich\",0.0]";
        String defaultUnit = "Degree\",0.0174532925199433]]";
        String defaultProjection = "Albers";
        String defaultLengthUnit = "Meter";
        double defaultLengthValue = 1.0;
        StringBuilder builder = new StringBuilder(500);

        builder.append("PROJCS[");
        builder.append("\"");  // quote
        builder.append(mapprojn);
        builder.append("\"");  // quote
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append("GEOGCS[");
        builder.append("\"");  // quote
        builder.append(defaultGcs);  // replace if the Gcs is found in the meta-data
        builder.append("\"");  // quote
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append("DATUM[");
        builder.append("\"");  // quote
        builder.append(horizdn);
        builder.append("\"");  // quote
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append("SPHEROID[");
        builder.append("\"");  // quote
        builder.append(ellips);
        builder.append("\"");  // quote
        builder.append(",");   // comma                
        builder.append(semiaxis);
        builder.append(",");   // comma
        builder.append(denflat);
        builder.append("]]");
        builder.append(",");   // comma
        builder.append(lineSep);

        builder.append("PRIMEM[");
        builder.append("\"");  // quote
        builder.append(defaultPrimeM);
        builder.append(",");
        builder.append(lineSep);

        builder.append("UNIT[");
        builder.append("\"");  // quote
        builder.append(defaultUnit);  //get pa
        builder.append(",");
        builder.append(lineSep);

        builder.append("PROJECTION[");
        builder.append("\"");  // quote
        builder.append(defaultProjection);
        builder.append("\"]");  // quote
        builder.append(",");
        builder.append(lineSep);

        builder.append(getParameterNode("False_Easting", feast));
        builder.append(",");
        builder.append(lineSep);

        builder.append(getParameterNode("False_Northing", fnorth));
        builder.append(",");
        builder.append(lineSep);

        builder.append(getParameterNode("Central_Meridian", longcm));
        builder.append(",");
        builder.append(lineSep);

        builder.append(getParameterNode("Standard_Parallel_1", 29.5)); //#TODO# relace with value
        builder.append(",");
        builder.append(lineSep);

        builder.append(getParameterNode("Standard_Parallel_2", stdparll));
        builder.append(",");
        builder.append(lineSep);

        builder.append(getParameterNode("Latitude_Of_Origin", latprjo));
        builder.append(",");
        builder.append(lineSep);

        builder.append("UNIT[");
        builder.append("\"");  // quote
        builder.append(defaultLengthUnit); //Meter
        builder.append("\"");  // quote
        builder.append(",");
        builder.append(defaultLengthValue);
        builder.append("]]");

        String wkt = builder.toString();
        System.out.println(wkt);

        assertNotNull(wkt);
        CoordinateReferenceSystem crs = CRS.parseWKT(wkt);
        assertNotNull(crs);
        // use some CRSUtils.lookup() feature to get the EPSG code
        Integer eCode = CRS.lookupEpsgCode(crs, true);
        String idCode = CRS.lookupIdentifier(crs, true);
        
        System.out.println("EPSG: " + eCode);
        System.out.println("Id : " + idCode);
        assertNotNull(idCode);
        //assertNull(wkt); // force a fail to see the output
    }

    private static String getParameterNode(String name, double value) {
        //exp PARAMETER["False_Easting",0.0]
        StringBuilder sb = new StringBuilder(50);

        sb.append("PARAMETER[");
        sb.append("\"");  // quote
        sb.append(name);
        sb.append("\"");  // quote
        sb.append(",");   // comma
        sb.append(value);
        sb.append("]");

        return sb.toString();
    }
}
