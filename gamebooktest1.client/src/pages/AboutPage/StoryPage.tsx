import { Link } from "react-router-dom";
import "./AboutStyles.css";

export const StoryPage = () => {
  return (
    <div className="retro-container">
      <h1 className="retro-title">Prolog</h1>
      <p className="retro-text">
        Svět se změnil. Někteří říkají, že k lepšímu. Jiní věří, že ke horšímu.
        Ale pro ty, kteří v těchto dobách hledali svoje štěstí na hraně nože, to
        byla doba příležitostí. Československo se rozpadlo, zákony se měnily,
        policie byla slabá a mafie se začala stávat neviditelným vládcem ulice.
        Kdo měl ostré lokty, peníze a přátele na správných místech, mohl
        vystoupat až na vrchol. Kdo ne, skončil v betonovém sarkofágu na dně
        řeky.
      </p>
      <br />
      <p className="retro-text">
        Viktor "Vítr" Pospíšil byl jednou z těch duší, které se snažily plout v
        proudu doby. Kamioňák, který se nikdy moc nestaral o to, co vlastně
        převážel. Důležité bylo, že to platilo úplně jinak než obyčejná dřina v
        továrně. A když přišel rozkaz od šéfa, prostě jste ho splnili. Nikdy se
        neptali. Nebylo to o svědomí, bylo to o přežití.
      </p>
      <br />
      <p className="retro-text">
        Jednoho večera se Viktor ocitl na odlehlém staveništi v Drážďanech. V
        kamionu měl několik balíků, o jejichž obsahu měl jen mlhavou představu.
        Havran, jeho šéf a tajemný muž, který držel v rukou nitky poloviny
        podsvětí, mu dal jednoduchý úkol – předat zásilku a vrátit se domů. Jak
        těžké to může být?
      </p>
      <br />
      <p className="retro-text">
        Jakmile se v dáli objevila černá dodávka, napětí vzduchu se dalo krájet.
        Dveře se otevřely a ven vystoupilo pět mužů. Těžký přízvuk jednoho z
        nich mu okamžitě napověděl, že tohle nejsou obyčejní obchodní partneři.
        Anatolij "Volk" Sidorov, jeden z klíčových mužů tambovského klanu, si
        Viktora dlouze změřil. "Ty jest od Havrana?" zaznělo chladně.
      </p>
      <br />
      <p className="retro-text">
        Zatímco muži nakládali zboží do dodávek, Anatolij se otočil k Viktorovi
        a vynesl z dodávky tašky plné peněz. "Tak tu máš, jak my domluvili." V
        tom momentě Viktor pochopil, že právě překročil hranici, za kterou už
        není návratu. Tohle nebyla obyčejná fuška. Tohle byl začátek něčeho
        většího. Něčeho, co ho mohlo vystřelit na vrchol – nebo poslat rovnou do
        hrobu.
      </p>
      <br />
      <p className="retro-text">
        Viktor si přepočítával bankovky v kufru, když si všiml, že Anatolijův
        pohled potemněl. "Víš, hochu, někdy to není jen o byznysu. Musíš si
        dávat pozor, komu věříš. Tohle je svět, kde se největší úsměvy mění v
        nejhlubší rány. A někdy ti ani nepomůže, že děláš to, co máš. Stačí
        jeden špatný pohyb a zmizíš."
      </p>
      <br />
      <p className="retro-text">
        Když se Viktor v noci vrátil do svého bytu, nebyl si už jistý ničím.
        Telefon zazvonil. Na druhé straně linky se ozval Havranův hluboký hlas:
        "Dobře ses osvědčil. Teď to ale začne bít na ostro. Máš před sebou dvě
        cesty – buď budeš jen poslušná loutka, nebo si vybojuješ svoje místo.
        Ale pamatuj, tady se nikdo neptá, co je správné. Jen kdo přežil."
      </p>
      <br />
      <p className="retro-text">
        Takhle začíná příběh Viktora Pospíšila, muže, který se narodil v chaosu
        devadesátek a naučil se v něm přežít. Každé rozhodnutí ho posune blíž k
        jednomu ze tří osudů – stane se mocným mužem podsvětí, spravedlivým
        bojovníkem proti korupci, nebo jen další obětí doby, kdy se život
        prodával za pár bankovek?
      </p>
      <br />
      <p className="retro-text">
        Svět se mění. Čas běží. Hra začíná. Zbytek je jen na tobě.
      </p>
      <br />
      <Link to="/" className="retro-link">
        Zahájit hru
      </Link>
    </div>
  );
};
