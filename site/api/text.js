const txt = "בּוֹאוּ עֲנָנִים, \n הָבוּ גֶּשֶׁם הַלְוַואי לַגַּנִּים \n טִיף, טִיף טִפּוֹתַי – \n גֶּשֶׁם, גֶּשֶׁם לִשְׂדוֹתַי. \n לַשִּׁבֹּלֶת, לַעוּגִיָה לָאִילָן \n וְלַפֶּרַח הַקָּטָן \n שֶׁבַּגַּן. \n \n זֶרֶם קוֹלֵחַ – גֶּשֶׁם בְּרָכָה \n נָח הַשָּׂדֶה וַיִּנְשֹׁם לִרְוָחָה. \n הַלְלוּיָהּ, \n הַלְלוּיָהּ, \n גֶּשֶׁם, גֶּשֶׁם בַּמֶּרְחַבְיָה מִיוּן.";
const txt_example = "מוֹרָה טוּר תַו דַוְוקַא הַלְוַואי תִיק דַי מִיוּן עוּגִיָה עוּגִיוֹת"
const txt2 = "סִיפּוּר \n אֶתְמוֹל אֲחוֹתִי הַקְטַנָה טַלִי חָזְרָה הַבַּיְתָה בּוֹכָה. לֹא סְתָם בּוֹכָה. צוֹרַחַת. אִמָא שֶׁלִי יָצְאָה בֶּרִיצָה מֵהַחֶדֶר שֶׁלָה וְצָעֲקָה 'מָה קָרָה?' \n " +

//   "גַם אֲנִי יָצָאתִי מֵהַחֶדֶר שֶׁלִי. נִבְהַלְתִי נוֹרָא. הַפָּנִים שֶׁל טַלִי הָיוּ מֶלֵאִים דָם. הַמֵצַח וְהַלֶחָיַיִם. כֹּל הַפָּנִים. אַבָּא שֶׁלִי יָצָא מֵהַמִקְלַחַת עִם מַגֶבֶת, כּוּלוֹ רָטוּב. אִמָא נִיגְבַה אֶת הַפָּנִים שֶׁל טַלִי וְחִיבְּקָה אוֹתָה. הִיא אָמְרָה לְאַבָּא שֶׁלִי: תִתְלַבֵּשׁ מַהֵר. נוֹסְעִים לֶחֲדַר מִיוּן. "

   "גַם אֲנִי יָצָאתִי מֵהַחֶדֶר שֶׁלִי. נִבְהַלְתִי נוֹרָא. הַפָּנִים שֶׁל טַלִי הָיוּ מֶלֵאִים דָם. הַמֵצַח וְהַלֶחָיַיִם. כֹּל הַפָּנִים. אַבָּא שֶׁלִי יָצָא מֵהַמִקְלַחַת עִם מַגֶבֶת, כּוּלוֹ רָטוּב. אִמָא נִיגְבַה אֶת הַפָּנִים שֶׁל טַלִי וְחִיבְּקָה אוֹתָה. הִיא אָמְרָה לְאַבָּא שֶׁלִי: תִתְלַבֵּשׁ מַהֵר. נוֹסְעִים לֶחֲדַר מִיוּן. אַבָּא שֶׁלִי הָלַךְ לְהִתְלַבֵּשׁ. הוּא שָׁאַל מֵהַחֶדֶר מָה קָרָה. אִמָא אָמְרָה לוֹ שֶׁטַלִי פָּתְחָה אֶת הַמֵצַח. טַלִי הִמְשִׁיכָה לִצְרוֹחַ. אִמָא שֶׁלִי נִיקְתָה לָה אֶת הַפֶּצַע בַּאַמְבַּטְיָה. אַחֲרֵי דַקָה אַבָּא שֶׁלִי יָצָא בְּלִי לִסְגוֹר אֶת הַחוּלְצָה וְכּוּלָנוּ יָרַדְנוּ לָאוֹטוֹ. בָּאוֹטוֹ טַלִי קְצָת נִרְגֶעָה. הִיא לֹא הִפְסִיקָה לִבְכּוֹת. אֲבָל הִיא הִצְלִיחָה לֶדָבֵּר. הִיא דִבְּרָה וְבָּכְתָה וְבָּכְתָה בֶּיַחַד. הָיוּ חוּטִים שֶׁל רוֹק בַּפֶּה שֶׁלָה. אִמָא הֶחְזִיקָה מַטְלִית רֶטוּבָה עַל הַמֵצַח שֶׁלָה וְקָרְאָה לָה בּוּבָּה שֶׁלִי וְנִחְמָה אוֹתָה. אַבָּא הָיָה רֶצִינִי. הוּא הִסְתַכֵּל עַל הַכְּבִישׁ. טַלִי סִפְּרָה שֶׁהִיא נָפְלָה מֵהַמַעֲקֶה בָּחָצֵר שֶׁל מֵירַב. הִיא נָפְלָה עַל הַמִדְרָכָה יָשָׁר עַל הַמֵצַח. \n " +


   "גַם אֲנִי יָצָאתִי מֵהַחֶדֶר שֶׁלִי. נִבְהַלְתִי נוֹרָא. הַפָּנִים שֶׁל טַלִי הָיוּ מֶלֵאִים דָם. הַמֵצַח וְהַלֶחָיַיִם. כֹּל הַפָּנִים. אַבָּא שֶׁלִי יָצָא מֵהַמִקְלַחַת עִם מַגֶבֶת, כּוּלוֹ רָטוּב. אִמָא נִיגְבַה אֶת הַפָּנִים שֶׁל טַלִי וְחִיבְּקָה אוֹתָה. הִיא אָמְרָה לְאַבָּא שֶׁלִי: תִתְלַבֵּשׁ מַהֵר. נוֹסְעִים לֶחֲדַר מִיוּן. אַבָּא שֶׁלִי הָלַךְ לְהִתְלַבֵּשׁ. הוּא שָׁאַל מֵהַחֶדֶר מָה קָרָה. אִמָא אָמְרָה לוֹ שֶׁטַלִי פָּתְחָה אֶת הַמֵצַח. טַלִי הִמְשִׁיכָה לִצְרוֹחַ. אִמָא שֶׁלִי נִיקְתָה לָה אֶת הַפֶּצַע בַּאַמְבַּטְיָה. אַחֲרֵי דַקָה אַבָּא שֶׁלִי יָצָא בְּלִי לִסְגוֹר אֶת הַחוּלְצָה וְכּוּלָנוּ יָרַדְנוּ לָאוֹטוֹ. בָּאוֹטוֹ טַלִי קְצָת נִרְגֶעָה. הִיא לֹא הִפְסִיקָה לִבְכּוֹת. אֲבָל הִיא הִצְלִיחָה לֶדָבֵּר. הִיא דִבְּרָה וְבָּכְתָה וְבָּכְתָה בֶּיַחַד. הָיוּ חוּטִים שֶׁל רוֹק בַּפֶּה שֶׁלָה. אִמָא הֶחְזִיקָה מַטְלִית רֶטוּבָה עַל הַמֵצַח שֶׁלָה וְקָרְאָה לָה בּוּבָּה שֶׁלִי וְנִחְמָה אוֹתָה. אַבָּא הָיָה רֶצִינִי. הוּא הִסְתַכֵּל עַל הַכְּבִישׁ. טַלִי סִפְּרָה שֶׁהִיא נָפְלָה מֵהַמַעֲקֶה בָּחָצֵר שֶׁל מֵירַב. הִיא נָפְלָה עַל הַמִדְרָכָה יָשָׁר עַל הַמֵצַח. \n " +

   "כְּשֶׁנִכְנַסְנוּ לַחֲדַר מִיוּן הִיא עוֹד פַּעַם הִתְחִילָה לִצְרוֹחַ. הִיא פָּחֲדָה מִמָה שֶׁיַעַשׂוּ לָה. הִיא צָעֲקָה שֶׁהִיא לֹא רוֹצָה זְרִיקָה. הִתְיַישַׁבְנוּ בַּתוֹר, וְאַבָּא שֶׁלִי נִגָשׁ לַדַלְפֵּק שֶׁמֵאֲחוֹרָיו יָשְׁבָה אָחוֹת.  טַלִי הִשְׁתַתְקָה קְצָת וְהִסְתַכְּלָה מִסָבִיב. לֶיָדִי יָשַׁב יֶלֶד קְצָת יוֹתֵר גָדוֹל מִמֶנִי שֶׁהָיְיתָה לוֹ כְּוִויָה עֲנָקִית עַל הַרֶגֶל. הַמִכְנָסַיִים שֶׁלֹו הָיוּ חֲתוּכִים כְּדֵי שֶׁהֵם לֹא יִגְעוּ בַּרֶגֶל, וְעַל הַכְּוִויָה הָיְיתָה מִשְׁחָה. גַם טַלִי רָאֲתָה אוֹתוֹ. הִיא הִשְׁתַתְקָה לְגַמְרֵי. הָיוּ שַׁם הָמוֹן אֲנָשִׁים. קָרוּ לָהֶם כֹּל מִינֵי דְבָרִים. הִיא שָׁאֲלָה אֶת אִמָא בֶּשֶׁקֶט אִם יַעֲשׂוּ לָה זְרִיקָה. אִמָא אָמְרָה שֶׁהִיא לֹא יוֹדַעַת. \n " +

   "טַלִי יָשְׁבָה עַל הַבִּרְכַּיִים שֶׁל אִמָא וְשָׂמָה אֶת הָרֹ אשׁ עַל הַכָּתֵף שֶׁלָה. אִמָא עָשְׂתָה אֶת הַפַּרְצוּף שֶׁהִיא תָמִיד עוֹשָׂה כְּשֶׁהִיא מוּדְאֶגֶת. הִיא עוֹשָׂה עִם הַשְׂפָתַיִים וְמִסְתַכֶּלֶת עַל הָרִצְפָּה בֶּעֵינַיִים פְּתוּחוֹת חָזָק. אַבָּא הִתְיַישֵׁב לֶיָדִי וְנִדְנֵד אֶת הָרֶגֶל. כְּשֶׁקָרְאוּ אֶת שֵׁם הַמִשְׁפָּחָה שֶׁלָנוּ, הוּא קָפַץ מֵהַכִּיסֵא וְנִיגָשׁ לְרוֹפֵא אֶחַד עִם זָקָן. הֵם דִבְּרוּ וְאַחַר כָּךְ הָרוֹפֵא הִצְבִּיעַ עַל וִילוֹן לָבָן וְאִמָא וְטַלִי נִכְנֶסוּ מֵאֲחוֹרָיו. אֲנִי וְאַבָּא יָשַׁבְנוּ בַּחוּץ. טַלִי צָרְחָה שֶׁהִיא לֹא רוֹצָה זְרִיקָה. אֲבָל בְּכֹל זֹ את עָשׂוּ לָה. אֲנִי לֹא רָצִיתִי לְהִישָׁאֵר שָׁם וְלִשְׁמוֹעַ אֶת הַצְרָחוֹת. בִּקָשְׁתִי מֵאַבָּא שֶׁנֵלֵךְ קְצָת הַחוּצָה, אֲבָל הוּא לֹא רָצָה. הוּא אָמַר שֶׁאֲנִי יָכוֹל, אִם אֲנִי רוֹצֶה, וְנָתַן לִי אֶת הַמַפְתֶחוֹת שֶׁל הָאוֹטוֹ. יָצָאתִי וְהִתְיַישַׁבְתִי בַּאוֹטוֹ, אֲבָל לֹא הָיְיתָה לִי סַבְלָנוּת. אָז יָצָאתִי וְנָעַלְתִי אוֹתוֹ וְטִיַילְתִי שָׁם בַּחֲנַיָיה. כָּל פַּעַם חָזַרְתִי לִבְדוֹק אִם נִגְמָר כְּבָר. זֶה לָקַח הָמוֹן זְמַן, אֲבָל בַּסוֹף טַלִי יָצְאָה עִם אִמָא. הָיְיתָה לָה תַחְבּוֹשֶׁת עַל הַמֵצַח. עָשׂוּ לָה תְפָרִים. \n " +

   "בַּלַיְלָה, כְּשֶׁשָׁכַבְתִי בַּמִיטָה שֶׁלִי, נִזְכַּרְתִי אֵיךְ שֶׁהַהוֹרִים שֶׁלִי אָמְרוּ לְטַלִי בַּדֶרֶךְ חָזָרָה שֶׁהִיא גִיבּוֹרָה. אֲנִי לֹא מֵבִין לָמָה הִיא כֹּל כָּךְ גִבּוֹרָה. הִיא כֹּל הַזְמַן בָּכְתָה. אִם זֶה הָיָה קוֹרֶה לִי לֹא הָיִיתִי בּוֹכֶה כֹּל כָּךְ הַרְבֵּה. הָיִיתִי אוֹמֵר לְאִמָא לֹא לִדְאוֹג וְשֶׁיִהיֶה בֶּסֵדֶר. בֶּאֶמֶת. הָיִיתִי מַרְגִיעַ אֶת כּוּלָם, אֲפִילוּ שֶׁהָיִיתִי פָּצוּעַ. בֶּעֶצֶם, קְצָת רָצִיתִי שֶׁזֶה יִקְרֶה לִי. לֹא מַמָשׁ, אֲבָל קְצָת. חָשַׁבְתִי אֵיךְ בְּבֵּית -הַסֵפֶר כּוּלָם יִשְׁאֲלוּ אוֹתִי מָה קָרָה, וְאֲנִי אַרְאֶה לָהֶם אֶת הַתְפָרִים. בֶּעֶצֶם, אַנִי לֹא מֵבִין לָמָה הָיוּ צְרִיכִים לַעֲשׂוֹת לָה תְפָרִים. זֶה לֹא הָיָה פֶּצַע כָּזֶה גָדוֹל. \n ";

const get_text = function(req, res)
{
    const text_obj = { text: txt2};
    res.send( JSON.stringify(text_obj));
}

module.exports.get_text = get_text;