import useFetch from "../public/useFetch.js";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react";


export default function App() {

  const [selectedInfo, setSelectedInfo] = useState(null);
  const [serie, setSerie] = useState("under the dome");

  const handlerSubmit = (e) => {
    e.preventDefault();
    let form = e.currentTarget;
    let urlString = new FormData(form).get("serie");
    setSerie(urlString);
  };



  const {
    data: showData,
    isLoading: isLoadingShow,
    error: showError
  } = useFetch(`https://api.tvmaze.com/singlesearch/shows?q=${serie}&embed[]=episodes&embed[]=cast&embed[]=seasons`);

  const handleSelectChange = (value) => {
    setSelectedInfo(value);
  };

  return (
    <div className="">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full flex justify-between items-center p-4 bg-background rounded-md shadow-sm shadow-accent">
          <img src="/Logo.svg" alt="Logo" className="w-24" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="" className="h-10 stroke-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>

        <form onSubmit={handlerSubmit} className="w-full flex gap-2 items-center">
          <input
            type="text"
            name="serie"
            placeholder="Rechercher une série..."
            className="flex-grow border border-gray-300 rounded-md p-2"
          />
          <Button type="submit" className="h-10 px-4">Search</Button>
        </form>

        <div className="text-center bg-background w-full p-4 rounded-md">
          <h1 className="text-2xl font-bold uppercase bg-gradient bg-clip-text text-transparent ">Vos films et séries, en ULTRA HD !</h1>
          <img className="w-32 mx-auto mt-4" src="/Logo.svg" alt="Vector" />
        </div>

        {showData && (
          <section className="w-full rounded-md shadow-sm shadow-accent">
            <div className="bg-background rounded-md">
              <h2 className="text-xl font-bold text-center bg-gradient bg-clip-text text-transparent p-4 w-full">{showData.name}</h2>
            </div>

            <div className="mt-4 space-y-4">
              {isLoadingShow ? (
                <div>Loading...</div>
              ) : showError ? (
                <div>Error: {showError}</div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-4 mt-4">
                  <img
                    className="bg-btmgradient rounded-md w-full"
                    src={showData.image.original}
                    alt={showData.name}
                  />
                  <div className="bg-background hover:bg-btmgradient transition-opacity duration-300 text-white bottom-0 p-4 rounded-md">
                    <div className="bottom-0 m-4">
                      <p><span className="font-bold">Language :</span> {showData?.language}</p>
                      <p><span className="font-bold">Status :</span> {showData?.status}</p>
                      <p className="" dangerouslySetInnerHTML={{ __html: showData.summary }}></p>
                      <div className="flex gap-4 pt-4">
                        {showData?.genres.map((genre, index) => (
                          <p key={index} className="bg-muted p-1 rounded-md">{genre}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              )}
              <Select onValueChange={handleSelectChange} className="mt-6">
                <SelectTrigger className="w-full bg-primary text-white">
                  <SelectValue placeholder="More infos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hide">Hide</SelectItem>
                  <SelectItem value="episodes">Episodes</SelectItem>
                  <SelectItem value="seasons">Seasons</SelectItem>
                  <SelectItem value="cast">Cast</SelectItem>
                </SelectContent>
              </Select>

            </div>



            <div className="flex flex-col gap-4 mt-4">
              {selectedInfo === "episodes" && (
                <div className="grid grid-cols-1sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {showData._embedded.episodes.map((film) => (
                    <div key={film.id} className="grid gap-4 md:flex-row border-b border-gray-200 bg-background rounded-md overflow-hidden">
                      <img className="h-auto w-full object-cover md:w-full" src={film.image.original} alt={film.name} />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{film.name}</h3>
                        <p className="text-sm">{film.summary.replace(/(<([^>]+)>)/gi, "")}</p>
                        <p className="text-sm text-secondary mt-2">Rating: {film.rating.average}/10</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedInfo === "cast" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {showData._embedded.cast.map((castMember) => (
                    <div key={castMember.person.id} className="grid grid-cols-2 gap-4 md:flex-row border-b border-accent bg-background rounded-md overflow-hidden">
                      <img className="h-40 w-40 object-cover md:w-full" src={castMember.person.image.original} alt={castMember.person.name} />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{castMember.person.name}</h3>
                        <p className="text-sm text-secondary">{castMember.character.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedInfo === "seasons" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {showData._embedded.seasons.map((season) => (
                    <div key={season.id} className="grid gap-4 md:flex-row border-b border-accent bg-background rounded-md overflow-hidden">
                      <img className="h-auto w-full object-cover md:w-full" src={season.image.original} alt={`Season ${season.number}`} />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">Season {season.number}</h3>
                        <p className="text-sm">{season.premiereDate} - {season.endDate || "Ongoing"}</p>
                        <p className="text-sm text-secondary mt-2">Episodes: {season.episodeOrder}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </section>
        )}
      </div>
      <div className="w-full flex flex-col gap-5 py-2 items-center justify-center">


        <Accordion type="single" collapsible className="bg-background px-4 rounded-md w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-foreground ">Qui sommes-nous ?</AccordionTrigger>
            <AccordionContent className="text-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="bg-background px-4 rounded-md w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-foreground">Nos abonnenents</AccordionTrigger>
            <AccordionContent className="text-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="bg-background px-4 rounded-md w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-foreground">Notre catalogue</AccordionTrigger>
            <AccordionContent className="text-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>


        <Accordion type="single" collapsible className="bg-background px-4 rounded-md w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-foreground">Contactez-nous</AccordionTrigger>
            <AccordionContent className="text-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>


        <div className="w-60 h-auto grid justify-center items-center grid-flow-col grid-cols-1 grid-rows-2 gap-2">
          <h1 className="bg-gradient text-transparent bg-clip-text uppercase text-center text-lg font-bold">
            Suivez-nous
          </h1>
          <div className="flex justify-center items-center gap-2">
            <a href="">
              <img src="/RS-1.svg" alt="Icône de Twitter" className="bg-primary rounded-full p-1 fill-foreground" />
            </a>
            <a href="">
              <img src="/RS-2.svg" alt="Icône de Twitter" className="bg-primary rounded-full p-1 fill-foreground" />
            </a>
            <a href="">
              <img src="/RS-3.svg" alt="Icône de Twitter" className="bg-primary rounded-full p-1 fill-foreground" />
            </a>
            <a href="">
              <img src="/RS-4.svg" alt="Icône de Twitter" className="bg-primary rounded-full p-1 fill-foreground" />
            </a>
          </div>
        </div>


        <div className="w-screen flex flex-col align-center px-10 text-foreground font-light underline gap-1 ">

          <a href="">FAQ</a>

          <a href="">Centre d'aide</a>

          <a href="">Presse</a>

          <a href="">Préférences de cookies</a>

          <a href="">Mentions légales</a>

          <a href="">Confidentialité</a>

          <a href="">Condition d’utilisation</a>

          <a href="">Compte</a>

          <a href="">Recrutement</a>

        </div>

        <div className="w-full bg-primary flex justify-center items-center rounded-md">

          <a href=""><img src="/Logo.svg" alt="Logo du site de streaming Pacifico" /></a>

        </div>

      </div>




    </div>
  );
}
